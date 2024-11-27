import { set, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Marker,
} from "@vis.gl/react-google-maps"; // Importando Marker
import PlaceAutocomplete from "../MapsComponents/InputMapsAutoComplete";
import { useState, useEffect } from "react";
import { Polyline } from "../MapsComponents/Polyline";

const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;

export interface DataRequestTravel {
  custumer_id: string;
  origin: string;
  destination: string;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

//Interface da resposta da API
interface TravelResonse {
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

const schema = yup.object({
  custumer_id: yup
    .string()
    .required("O campo de usuário não pode ser em branco."),
  origin: yup.string().required("O campo origem não pode ser vazio."),
  destination: yup.string().required("O campo destino não pode ser vazio."),
});

export default function RequestTravel() {
  const [requestSuccessful, setRequestSuccessful] = useState<boolean>(false);
  const [resTravelOpt, setResTravelOpt] = useState<TravelResonse | null>(null);
  const [encodedPolyline, setEncodedPolyline] = useState<string>("");
  const [travelInvalid, setTravelInvalid] = useState<{
    status: boolean;
    error: object;
  }>({ status: false, error: {} });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<DataRequestTravel>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<DataRequestTravel> = async (data) => {
    try {
      const res = await fetch("http://localhost:8080/ride/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 200) {
        const travelOptions: TravelResonse = await res.json();
        setResTravelOpt(travelOptions);
        setEncodedPolyline(
          travelOptions.routeResponse.routes[0].polyline.encodedPolyline
        );
        setRequestSuccessful(true);
      } else if (res.status === 202) {
        const invalid = { status: true, error: await res.json()}
        setTravelInvalid(invalid);
      }
    } catch (error) {
      
      console.error(error);
      setRequestSuccessful(false);
    }
  };

  // Função para ajustar o zoom e o centro do mapa com base na rota
  const getMapBounds = () => {
    if (resTravelOpt) {
      const { origin, destination } = resTravelOpt;
      const latitudes = [origin.latitude, destination.latitude];
      const longitudes = [origin.longitude, destination.longitude];

      // Calcular a extensão da rota
      const latMin = Math.min(...latitudes);
      const latMax = Math.max(...latitudes);
      const lngMin = Math.min(...longitudes);
      const lngMax = Math.max(...longitudes);

      return { latMin, latMax, lngMin, lngMax };
    }
    return { latMin: 0, latMax: 0, lngMin: 0, lngMax: 0 };
  };

  // Função para calcular o zoom com base na extensão da rota
  const calculateZoom = (bounds: any) => {
    const latDiff = bounds.latMax - bounds.latMin;
    const lngDiff = bounds.lngMax - bounds.lngMin;
    const maxDiff = Math.max(latDiff, lngDiff);

    if (maxDiff > 0.1) return 12;
    if (maxDiff > 0.05) return 13;
    if (maxDiff > 0.02) return 14;
    return 20;
  };

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [mapZoom, setMapZoom] = useState<number>(12);

  useEffect(() => {
    if (resTravelOpt) {
      const bounds = getMapBounds();
      const zoom = calculateZoom(bounds);

      setMapCenter({
        lat: bounds.latMin + (bounds.latMax - bounds.latMin) / 2,
        lng: bounds.lngMin + (bounds.lngMax - bounds.lngMin) / 2,
      });

      setMapZoom(zoom);
    }
  }, [resTravelOpt]);

  return (
    <APIProvider apiKey={GOOGLE_API_KEY}>
      <div
        className={`${
          requestSuccessful ? "max-w-screen-lg" : "max-w-screen-md"
        }  m-auto flex items-center flex-col justify-center mt-5 py-6 px-8 md:p-0`}
      >
        <h1 className="w-96 text-xl font-bold m-2">
          Preencha os dados abaixo para solicitar uma corrida.
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex gap-3 ${
            requestSuccessful ? "flex-row" : "flex-col w-96"
          }`}
        >
          <div>
            <label htmlFor="custumer_id">Seu nome:</label>
            <input
              {...register("custumer_id")}
              id="custumer_id"
              placeholder="Digite seu nome"
            />
            <span className="text-red-500">{errors.custumer_id?.message}</span>
          </div>

          <div>
            <label htmlFor="origin">Origem:</label>
            <PlaceAutocomplete
              trigger={trigger}
              clearErrors={clearErrors}
              fieldName="origin"
              setValue={setValue}
            />
            <span className="text-red-500">{errors.origin?.message}</span>
          </div>

          <div>
            <label htmlFor="destination">Destino:</label>
            <PlaceAutocomplete
              trigger={trigger}
              clearErrors={clearErrors}
              fieldName="destination"
              setValue={setValue}
            />
            <span className="text-red-500">{errors.destination?.message}</span>
          </div>

          <button
            type="submit"
            className={`${
              requestSuccessful ? "self-end justify-self-end mt-0 " : " "
            }px-3 py-3 rounded-lg bg-blue-950 mt-2 text-white text-xl hover:scale-105 hover:bg-blue-800 transition`}
          >
            Buscar Motoristas
          </button>
        </form>
        {!requestSuccessful ? (
          <>
            {travelInvalid.status ? (
              <>
                <span className="p-6 text-lg">
                  {JSON.stringify(travelInvalid.error)}
                </span>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <div className="w-[700px] h-[600px] relative p-6">
              <Map
                id="map1"
                mapId={"map1"}
                center={mapCenter}
                zoom={mapZoom}
                gestureHandling={"none"}
                zoomControl={false}
                scrollwheel={false}
                disableDefaultUI={true}
                style={{ width: "100%", height: "100%" }}
              >
                <AdvancedMarker
                  title={"A"}
                  position={{
                    lat: resTravelOpt?.origin.latitude as number,
                    lng: resTravelOpt?.origin.longitude as number,
                  }}
                />
                <AdvancedMarker
                  title={"B"}
                  position={{
                    lat: resTravelOpt?.destination.latitude as number,
                    lng: resTravelOpt?.destination.longitude as number,
                  }}
                />

                <Polyline
                  strokeWeight={6}
                  strokeColor={"#008dd890"}
                  encodedPath={encodedPolyline}
                />
              </Map>
            </div>
          </>
        )}
      </div>
    </APIProvider>
  );
}
