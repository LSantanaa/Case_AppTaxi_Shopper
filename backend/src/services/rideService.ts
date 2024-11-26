import axios from "axios";
import { GOOGLE_API_KEY } from "../config/env";
import prisma from "../config/prismaClient";

const API_URL = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_API_KEY}`;
const HEADERS = {
  "Content-Type": "application/json",
  "X-Goog-FieldMask":
    "routes.duration,routes.legs.startLocation,routes.legs.endLocation,routes.distanceMeters,routes.polyline.encodedPolyline",
};

interface TravelData {
  custumer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver:{
    id: number,
    name: string,
  }
  value: number;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

interface TravelResponse {
  origin: LatLng;
  destination: LatLng;
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

/**
 * Interface para a resposta esperada da API, com base nos filtros no Header na requisição
 */
interface ApiResponse {
  routes: {
    legs: {
      startLocation: {
        latLng: LatLng;
      };
      endLocation: {
        latLng: LatLng;
      };
    }[];
    distanceMeters: number;
    duration: string;
    polyline: {
      encodedPolyline: string;
    };
  }[];
}


//função para resgatar motoristas salvos no banco
export const getDriversDB = async ()=>{
  return await prisma.drivers.findMany({
    include:{
      reviews:{
        select:{
          rating: true,
          comment: true,
        }
      }
    }
  });
}

//faz a requisição para a Route Api do google e retorna se estiver dentro da regra
export const requestTravelToApi = async (
  origin: string,
  destination: string
): Promise<TravelResponse> => {
  try {
    const res = await axios.post<ApiResponse>(
      API_URL,
      {
        origin: { address: origin },
        destination: { address: destination },
        travelMode: "DRIVE",
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
   
    const driversDB = await getDriversDB();

    const driversOptions = driversDB.filter(driver => (driver.minKM * 1000) <= route.distanceMeters)
    .map((driver) => ({
      id: driver.id,
      name: driver.name,
      description: driver.description,
      vehicle: driver.car,
      review: driver.reviews[0],
      value: Number((driver.rateKM * (route.distanceMeters / 1000)).toFixed(2)),
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

    //valida todos os campos recebidos no request, lançando a exceção de Invalid Data se encontrar algo errado
    if (
      !origin ||
      !destination ||
      !custumer_id ||
      !distance ||
      typeof distance !== "number" ||
      isNaN(distance) ||
      !duration ||
      !value ||
      typeof value !== "number" ||
      isNaN(value) ||
      origin === destination
    ) {
      throw {
        status: 400,
        error_code: "INVALID_DATA",
        error_description:
          "Os dados fornecidos no corpo da requisição são inválidos",
      };
    }

    //busca no dbDriver se o motorista selecionado existe
    const driversDB = await getDriversDB()
    const selectedDriver = driversDB.find(driverDB => driverDB.id === Number(driver.id) && driverDB.name === driver.name);

    if (!selectedDriver) {
      throw {
        status: 404,
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Motorista Não Encontrado",
      };
    }

    if ((distance / 1000) < selectedDriver.minKM ) {
      throw {
        status: 406,
        error_code: "INVALID_DISTANCE",
        error_description: `Quilometragem inválida para o motorista`,
      };
    }

    await prisma.travelsHistory
      .create({
        data: {
          custumer_id: custumer_id.toLowerCase(),
          origin,
          destination,
          distance,
          duration,
          driver_id: selectedDriver.id,
          value,
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//consulta as viagens de determinado usuário podendo filtrar por motorista
export const getTravelsForUser = async (
  custumer_id: string,
  driver_id: number
) => {
  try {
    //se um motorista for informado,verifica se é um motorisa válido
    if (driver_id) {
      const isValidDriver = (await getDriversDB()).find((driver) =>
        Number(driver.id) === driver_id ? true : false
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

    const rides = await prisma.travelsHistory
      .findMany({
        where: paramsWhere,
        orderBy: { date: "desc" },
      })
      .finally(async () => {
        await prisma.$disconnect();
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
