import { ConfirmTravel } from "../../types";
import Star from "../Star";

interface DriverCardProps {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  value: number;
  onSelect: (data: ConfirmTravel) => void;
}

const DriverCard = ({
  customer_id,
  origin,
  destination,
  distance,
  duration,
  id,
  name,
  description,
  vehicle,
  review,
  value,
  onSelect,
}: DriverCardProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} isActive={i <= rating} />);
    }
    return stars;
  };

  const rideFormatted:ConfirmTravel = {
    customer_id,
    destination,
    origin,
    distance,
    duration,
    value,
    driver:{
      id,
      name,
    }
  }

  return (
    <div className="border p-5 rounded-lg shadow-shopper-card flex flex-col gap-2 items-start max-w-80 min-h-[560px bg-[#E8F3D8] bg-shopper">
      <div className="text-lg flex items-center gap-3">
        <img
          src={`/${id}.webp`}
          className="block rounded-full h-full"
          width={90}
          height={90}
          alt="Foto de perfil"
        />
        <h3 className="text-lg text-center font-semibold">{name}</h3>
      </div>
      <div>
        <p>{description}</p>
        <p className="mt-2">Veículo: {vehicle}</p>
      </div>
      <div>
        <p className="font-semibold text-xl">Valor da corrida: R$ {value}</p>
      </div>
      <div>
        <h3 className="mb-2 font-bold">Ultima avaliação</h3>
        <div>
          <div className="flex items-center gap-2">
            {renderStars(review.rating)}
          </div>
          <p className="mt-2">{review.comment}</p>
        </div>
      </div>
      <button
        onClick={() => onSelect(rideFormatted)}
        className="w-full px-3 py-2 rounded-lg bg-blue-950 mt-2 text-white text-xl justify-end hover:scale-105 hover:bg-blue-800 transition"
      >
        Escolher
      </button>
    </div>
  );
};

export default DriverCard;
