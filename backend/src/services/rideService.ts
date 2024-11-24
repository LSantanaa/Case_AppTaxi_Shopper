import axios from "axios";
import { GOOGLE_API_KEY } from "../config/env.";
import { dataDrivers } from "../db/dbDriver";
import prisma from "../db/prisma";

const API_URL = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_API_KEY}`;
const HEADERS = {
  "Content-Type": "application/json",
  "X-Goog-FieldMask":
    "routes.duration,routes.legs.startLocation,routes.legs.endLocation,routes.distanceMeters,routes.polyline.encodedPolyline",
};

interface LatLng {
  latitude: number;
  longitude: number;
}

interface TravelResponse {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
      rating: number;
      comment: string;
    };
    value: number;
  }[];
  routeResponse: object;
}

interface TravelData {
  custumer_id: number;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

/**
 * Interface para a resposta esperada da API, com base nos filtros no Header na requisição
 */
interface ApiResponse {
  routes: {
    legs: {
      startLocation: {
        latLng: {
          latitude: number;
          longitude: number;
        };
      };
      endLocation: {
        latLng: {
          latitude: number;
          longitude: number;
        };
      };
    }[];
    distanceMeters: number;
    duration: string;
    polyline: {
      encodedPolyline: string;
    };
  }[];
}

//faz a requisição para a Route Api do google e retorna se estiver dentro da regra
export const requestTravelToApi = async (
  origin: LatLng,
  destination: LatLng,
  travelMode: "DRIVE"
): Promise<TravelResponse> => {
  try {
    const res = await axios.post<ApiResponse>(
      API_URL,
      {
        origin: { location: { latLng: origin } },
        destination: { location: { latLng: destination } },
        travelMode,
        computeAlternativeRoutes: false,
      },
      {
        headers: HEADERS,
      }
    );

    const route = res.data.routes[0];
    const leg = route.legs[0];

    /**
     * filtra os motoristas disponíveis com base na distância da viagem e km mínimo do motorista, retornando
     * somente quem deve atender e o valor.
     */
    const driversOptions = dataDrivers
      .filter((driver) => driver.minMeters <= route.distanceMeters)
      .map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.car,
        review: driver.review,
        value: Number(
          (driver.rateKM * (route.distanceMeters / 1000)).toFixed(2)
        ),
      }));

    const Travel: TravelResponse = {
      origin: {
        latitude: leg.startLocation.latLng.latitude,
        longitude: leg.startLocation.latLng.longitude,
      },
      destination: {
        latitude: leg.endLocation.latLng.latitude,
        longitude: leg.endLocation.latLng.longitude,
      },
      distance: route.distanceMeters,
      duration: route.duration,
      options: driversOptions,
      routeResponse: res.data,
    };

    return Travel;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

//salva a viagem no banco de dados se tudo estiver dentro das regras
export const saveTravelInDb = async (travelData: TravelData) => {
  try {
    const {
      custumer_id,
      origin,
      destination,
      distance,
      duration,
      driver,
      value,
    } = travelData;

    if (!origin || !destination || !custumer_id || origin === destination) {
      throw {
        status: 400,
        error_code: "INVALID_DATA",
        error_description:
          "Os dados fornecidos no corpo da requisição são inválidos",
      };
    }

    const selectedDriver = dataDrivers.find(
      (driverDB) => driverDB.id === driver.id && driverDB.name === driver.name
    );
    if (!selectedDriver) {
      throw {
        status: 404,
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Motorista Não Encontrado",
      };
    }

    if (distance < selectedDriver.minMeters) {
      throw {
        status: 406,
        error_code: "INVALID_DISTANCE",
        error_description: `Quilometragem inválida para o motorista`,
      };
    }

    await prisma.travelsHistory.create({
      data: {
        custumer_id,
        origin,
        destination,
        distance,
        duration,
        driver_id: driver.id,
        driver_name: driver.name,
        value,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//consulta as viagens de determinado usuário podendo filtrar por motorista
export const getTravelsForUser = async (
  custumer_id: number,
  driver_id: number
) => {
  try {
    //se um motorista for informado,verifica se é um motorisa válido
    if (driver_id) {
      const isValidDriver = dataDrivers.find((driver) =>
        driver.id === driver_id ? true : false
      );

      if (!isValidDriver) {
        throw {
          status: 400,
          error_description: "Motorisa Inválido",
          error_code: "INVALID_DRIVER",
        };
      }
    }

    const paramsWhere = driver_id
      ? { custumer_id, driver_id }
      : { custumer_id };

    const rides = await prisma.travelsHistory.findMany({
      where: paramsWhere,
      orderBy: { date: "desc" },
    });

    if (rides.length < 1) {
      throw {
        status: 404,
        error_description: "Nenhum registro encontrado",
        error_code: "NO_RIDES_FOUND",
      };
    }

    return rides;
  } catch (error) {
    console.error(error);
    throw error;
  }
};