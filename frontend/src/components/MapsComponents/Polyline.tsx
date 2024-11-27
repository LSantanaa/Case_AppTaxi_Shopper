/**
 * Código da documentação por @vis.gl, biblioteca responsável por carregar as APIs do google Maps.
 */

import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';

import {GoogleMapsContext, useMapsLibrary} from '@vis.gl/react-google-maps';

import type {Ref} from 'react';

type PolylineEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
};

type PolylineCustomProps = {
  encodedPath?: string;
};

export type PolylineProps = google.maps.PolylineOptions &
  PolylineEventProps &
  PolylineCustomProps;

export type PolylineRef = Ref<google.maps.Polyline | null>;

function usePolyline(props: PolylineProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    encodedPath,
    ...polylineOptions
  } = props;
  //Isso está aqui para evitar disparar o useEffect abaixo quando os callbacks mudam (o que acontece se o usuário não os memoizar)
  const callbacks = useRef<Record<string, (e: unknown) => void>>({});
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut
  });

  const geometryLibrary = useMapsLibrary('geometry');

  const polyline = useRef(new google.maps.Polyline()).current;

  /* Atualizar as PolylineOptions (note que as dependências não são verificadas corretamente aqui, 
  assumimos que o setOptions é inteligente o suficiente para não gastar muito tempo atualizando 
  valores que não mudaram)*/
  useMemo(() => {
    polyline.setOptions(polylineOptions);
  }, [polyline, polylineOptions]);

  const map = useContext(GoogleMapsContext)?.map;

  useMemo(() => {
    if (!encodedPath || !geometryLibrary) return;
    const path = geometryLibrary.encoding.decodePath(encodedPath);
    polyline.setPath(path);
  }, [polyline, encodedPath, geometryLibrary]);

  
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Polyline> has to be inside a Map component.');

      return;
    }

    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [map]);

  //Anexar e reanexar os manipuladores de evento quando qualquer uma das propriedades mudar
  useEffect(() => {
    if (!polyline) return;

    // Add event listeners
    const gme = google.maps.event;
    [
      ['click', 'onClick'],
      ['drag', 'onDrag'],
      ['dragstart', 'onDragStart'],
      ['dragend', 'onDragEnd'],
      ['mouseover', 'onMouseOver'],
      ['mouseout', 'onMouseOut']
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(polyline, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback];
        if (callback) callback(e);
      });
    });

    return () => {
      gme.clearInstanceListeners(polyline);
    };
  }, [polyline]);

  return polyline;
}

/**
 * Component to render a polyline on a map
 */
export const Polyline = forwardRef((props: PolylineProps, ref: PolylineRef) => {
  const polyline = usePolyline(props);

  useImperativeHandle(ref, () => polyline, []);

  return null;
});