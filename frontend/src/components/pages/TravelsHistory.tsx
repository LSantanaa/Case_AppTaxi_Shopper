import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface DataRequestHistory {
  custumer_id: string;
  driver_id?:  string | undefined;
}

const schema = yup.object({
  custumer_id: yup
    .string()
    .required("O campo de usuário não pode ser em branco."),
  driver_id: yup.string(),
});

export default function TravelsHistory() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataRequestHistory>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<DataRequestHistory> = async (data) => {};

  return (
    <div className="max-w-screen-md m-auto flex items-center flex-col justify-center mt-5 py-6 px-8 md:p-0">
      <h1 className="w-96 text-xl font-bold m-2">
        Insira um usuário para buscar o histórico.
      </h1>
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
          <label htmlFor="driver_id">Motorista:</label>

          <select {...register("driver_id")}>
             <option value="">Todos</option>
           
            
          </select>

          <span>{errors.driver_id?.message}</span>
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
