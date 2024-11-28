import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { Polyline } from "./Polyline";
import { useEffect, useState } from "react";
import { TravelResonse } from "../../types";

interface MapProps{
  resTravelOpt: TravelResonse | null,
  encodedPolyline: string
}

const RenderMap = ({resTravelOpt, encodedPolyline}:MapProps) => {
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
    return 15;
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
  );
};


export default RenderMap;