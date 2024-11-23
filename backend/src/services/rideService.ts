import axios from "axios";
import { GOOGLE_API_KEY } from "../config/env.";
import { dataDrivers } from "../db/dbDriver";

const API_URL = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_API_KEY}`;

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

export const computeRoute = async (
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
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "routes.duration,routes.legs.startLocation,routes.legs.endLocation,routes.distanceMeters,routes.polyline.encodedPolyline",
        },
      }
    );

    const route = res.data.routes[0];
    const leg = route.legs[0];

    const driversOptions = dataDrivers
      .filter((driver) => driver.minMeters <= route.distanceMeters)
      .map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.car,
        review: driver.review,
        value: driver.rateKM * (route.distanceMeters / 1000),
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
    console.error(
      "Error fetching route:",
      error.response?.data || error.message
    );
    throw new Error("Falha ao enviar dados para a API");
  }
};
