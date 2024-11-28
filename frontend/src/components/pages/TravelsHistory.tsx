import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRideService } from "../../hooks/useApi";
import { HistoryType } from "../../types";
import CardHistory from "../CardHistory";

interface DataRequestHistory {
  custumer_id: string;
  driver_id?: string | undefined;
}

interface Drivers {
  driver_name: string;
  driver_id: number;
}

const DataDrivers: Drivers[] = [
  {
    driver_id: 1,
    driver_name: "Homer Simpson",
  },
  {
    driver_id: 2,
    driver_name: "Dominic Toretto",
  },
  {
    driver_id: 3,
    driver_name: "James Bond",
  },
];

const schema = yup.object({
  custumer_id: yup
    .string()
    .required("O campo de usuário não pode ser em branco."),
  driver_id: yup.string(),
});

export default function TravelsHistory() {
  const { getHistory, getDrivers, loading } = useRideService();

  const location = useLocation();
  const { customer_id_state } = location.state || {};
  const [drivers, setDrivers] = useState<Drivers[]>(DataDrivers);
  const [history, setHistory] = useState<HistoryType[]>();
  const [requestSuccessful, setRequestSuccessful] = useState<boolean>(false);
  const [travelInvalid, setTravelInvalid] = useState<{
    status: boolean;
    error: string | null;
  }>({ status: false, error: "" });

  const fetchHistory = async (customer_id: string, driver_id?: number) => {
    if (customer_id) {
      try {
        const historyRes = await getHistory(customer_id, driver_id);
        if (historyRes.rides) {
          setHistory(historyRes.rides);
          setRequestSuccessful(true);
          setTravelInvalid({ status: false, error: "" });
        }
      } catch (err: any | null) {
        console.error("Erro ao confirmar sua corrida:", err);
        setRequestSuccessful(false);
        setTravelInvalid({ status: true, error: err.message });
      }
    }
  };

  const fetchDrivers = async () => {
    const resDrivers: Drivers[] = await getDrivers();
    setDrivers(resDrivers);
  };

  useEffect(() => {
    fetchHistory(customer_id_state);
  }, [customer_id_state]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<DataRequestHistory>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<DataRequestHistory> = async (data) => {
    const convertedDriverId = Number(data.driver_id);
    fetchHistory(data.custumer_id, convertedDriverId);
    location.state = ""
  };

  return (
    <>
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
              {drivers.map((driver) => (
                <option key={driver.driver_id} value={driver.driver_id}>
                  {driver.driver_name}
                </option>
              ))}
            </select>

            <span>{errors.driver_id?.message}</span>
          </div>

          <button
            type="submit"
            className="px-3 py-3 rounded-lg bg-blue-950 mt-2 text-white text-xl hover:scale-105 hover:bg-blue-800 transition"
          >
            {loading ? "Buscando..." : "Buscar Histórico"}
          </button>
        </form>
      </div>
      {travelInvalid.status && (
        <span className="text-xl text-red-500 font-bold">
          {travelInvalid.error}
        </span>
      )}
      {requestSuccessful && (
        <div className="py-4 px-8">
          <h2 className="text-2xl font-bold m-2">
            Histórico de {customer_id_state || getValues("custumer_id")}:
          </h2>

          <div className="flex md:flex-row flex-col gap-6 flex-wrap">
            {history?.map((h) => (
              <CardHistory {...h} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
