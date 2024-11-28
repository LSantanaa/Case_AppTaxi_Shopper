import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PlaceAutocomplete from "../MapsComponents/InputMapsAutoComplete";
import { DataRequestTravel } from "../../types";

const schema = yup.object({
  customer_id: yup
    .string()
    .required("O campo de usuário não pode ser em branco.").trim(),
  origin: yup.string().required("O campo origem não pode ser vazio.").trim(),
  destination: yup.string().required("O campo destino não pode ser vazio.").trim(),
});

interface TravelFormProps {
  onSubmit: SubmitHandler<DataRequestTravel>;
  requestSuccessful?: boolean
  loading?:boolean
}

export const TravelForm = ({onSubmit, requestSuccessful,loading}:TravelFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<DataRequestTravel>({
    resolver: yupResolver(schema),
  });

  return (
    <form 
          onSubmit={handleSubmit(onSubmit)}
          className={`flex gap-3 w-full justify-center md:max-w-96 ${
            requestSuccessful ? "md:flex-row flex-col md:max-w-full" : "flex-col"
          }`}
        >
          <div>
            <label htmlFor="custumer_id">Seu nome ou ID:</label>
            <input
              {...register("customer_id")}
              id="custumer_id"
              placeholder="Digite seu nome ou id"
            />
            <span className="text-red-500">{errors.customer_id?.message}</span>
          </div>

          <div>
            <label htmlFor="origin">Origem:</label>
            <PlaceAutocomplete
              clearErrors={clearErrors}
              fieldName="origin"
              setValue={setValue}
            />
            <span className="text-red-500">{errors.origin?.message}</span>
          </div>

          <div>
            <label htmlFor="destination">Destino:</label>
            <PlaceAutocomplete
              clearErrors={clearErrors}
              fieldName="destination"
              setValue={setValue}
            />
            <span className="text-red-500">{errors.destination?.message}</span>
          </div>

          <button
            type="submit"
            className={`${
              requestSuccessful
                ? "md:self-end md:justify-self-end md:mt-0 "
                : " "
            }px-3 py-3 rounded-lg bg-blue-950 mt-2 text-white text-xl hover:scale-105 hover:bg-blue-800 transition`}
          >
            {loading? "Calculando..." : "Calcular Viagem"}
          </button>
        </form>
  );
};
