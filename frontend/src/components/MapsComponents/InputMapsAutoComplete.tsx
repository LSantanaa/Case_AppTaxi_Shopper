import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { UseFormClearErrors, UseFormSetValue } from "react-hook-form";
import { DataRequestTravel } from "../../types";

export default function PlaceAutocomplete({fieldName,setValue, clearErrors}: {fieldName: "origin" | "destination"; setValue: UseFormSetValue<DataRequestTravel>; clearErrors:UseFormClearErrors<DataRequestTravel>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "name", "formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        // Atualiza o valor do campo de input com o endereço selecionado
        inputRef.current!.value = place.formatted_address;

        // Atualiza o valor no React Hook Form
        setValue(fieldName, place.formatted_address);
        clearErrors(fieldName)
      }
    });
  }, [places, setValue, fieldName]);

  const handleBlur = async () => {
    if (inputRef.current) {
      const manualValue = inputRef.current.value;
      if (manualValue) {
        setValue(fieldName, manualValue); 
        clearErrors(fieldName)
      }
    }
  };

  return <input ref={inputRef} id={fieldName} onBlur={handleBlur} placeholder={`Digite o ${fieldName === 'origin' ? "ponto de partida" : "destino"}`} />;
}
