import { HistoryType } from "../../types";

const CardHistory = (data: HistoryType) => {
  const infoDate = new Date(data.date);

  const day = String(infoDate.getDate()).padStart(2, "0");
  const month = String(infoDate.getMonth() + 1).padStart(2, "0");
  const year = infoDate.getFullYear();

  const hours = String(infoDate.getHours()).padStart(2, "0");
  const minutes = String(infoDate.getMinutes()).padStart(2, "0");

  const formattedDate = `${day}/${month}/${year} às ${hours}:${minutes}`;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full flex flex-col gap-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-blue-900">
          Detalhes da Corrida
        </h3>
        <span className="text-gray-500 text-sm">{formattedDate}</span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-gray-700">
          <span className="font-semibold">Motorista:</span> {data.driver.name}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Origem:</span> {data.origin}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Destino:</span> {data.destination}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Distância:</span> {data.distance}{" "}
          metros ({(data.distance / 1000).toFixed(2)} KM)
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Tempo de percurso:</span>{" "}
          Aproximadamente{" "}
          {(parseInt(data.duration.replace("s", ""), 10) / 60).toFixed()}{" "}
          minutos.
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Valor:</span> R$ {data.value}
        </p>
      </div>
    </div>
  );
};

export default CardHistory;
