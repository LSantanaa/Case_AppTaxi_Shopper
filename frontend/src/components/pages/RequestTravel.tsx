import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface DataRequest {
  custumer_id: string;
  origin: string;
  destination: string;
}

const schema = yup.object({
  custumer_id: yup
    .string()
    .required("O campo de usuário não pode ser em branco."),
  origin: yup.string().required("O campo origem não pode ser vazio"),
  destination: yup.string().required("O campo destino não pode ser vazio."),
});

export default function RequestTravel() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataRequest>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<DataRequest> = async (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-screen-md m-auto flex items-center flex-col justify-center mt-5 py-6 px-8 md:p-0">
      <h1 className="w-96 text-xl font-bold m-2">Preencha os dados abaixo para solicitar uma corrida.</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-96"
      >
        <div>
          <label htmlFor="custumer_id">Seu nome:</label>
          <input {...register("custumer_id")} id="custumer_id" />
          <span>{errors.custumer_id?.message}</span>
        </div>

        <div>
          <label htmlFor="origin">Origem:</label>
          <input {...register("origin")} id="origin" />
          <span>{errors.origin?.message}</span>
        </div>

        <div>
          <label htmlFor="destination">Destino:</label>
          <input {...register("destination")} id="destination" />
          <span>{errors.destination?.message}</span>
        </div>

        <button
          type="submit"
          className="px-3 py-3 rounded-lg bg-blue-950 mt-2 text-white text-xl hover:scale-105 hover:bg-blue-800 transition"
        >
          Buscar Motoristas
        </button>
      </form>
    </div>
  );
}
