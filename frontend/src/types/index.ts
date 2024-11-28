export interface DataRequestTravel {
  customer_id: string;
  origin: string;
  destination: string;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

//Interface da resposta da solicitação da viagem
export interface TravelResonse {
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
  routeResponse: {
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
  };
}

export interface ConfirmTravel {
  customer_id: string;
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

export interface HistoryType {
  id: number;
  customer_id: string;
  destination: string;
  origin: string;
  distance: number;
  duration: string;
  driver: {name: string}
  driver_id: number;
  value: number;
  date: string;
}
