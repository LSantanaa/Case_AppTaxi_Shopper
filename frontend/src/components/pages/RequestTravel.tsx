import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TravelForm } from "../FormRequestTravel";
import { useRideService } from "../../hooks/useApi";
import { TravelResonse, DataRequestTravel, ConfirmTravel } from "../../types";
import RenderMap from "../MapsComponents/Map";
import DriverCard from "../CardDriver";

const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;


export default function RequestTravel() {

  const navigate = useNavigate()

  const { estimateRide, confirmRide, loading, error } = useRideService();

  const [requestSuccessful, setRequestSuccessful] = useState<boolean>(false);
  const [resTravelOpt, setResTravelOpt] = useState<TravelResonse | null>(null);
  const [encodedPolyline, setEncodedPolyline] = useState<string>("");
  const [travelInvalid, setTravelInvalid] = useState<{status: boolean;error: string | null;}>({ status: false, error: "" });
  const [formData, setFormData] = useState<DataRequestTravel | null>(null)

  
  const HandleSubmitTravel = async (data:DataRequestTravel) => {
    try {
      setFormData(data)
      const rideOptions:TravelResonse = await estimateRide(data);
      setResTravelOpt(rideOptions);
      setRequestSuccessful(true);
      setEncodedPolyline(rideOptions.routeResponse.routes[0].polyline.encodedPolyline)
      setTravelInvalid({status: false, error: ""})
    } catch (err:any | null) {
      setFormData(null)
      console.error("Erro ao estimar a corrida:", err);
      setRequestSuccessful(false)
      setTravelInvalid({status: true, error: err.message})
    }
  };

  const handleSelectDriver = async (data: ConfirmTravel) => {

    try {
      const confirm:boolean = await confirmRide(data);

      if(confirm){
        setRequestSuccessful(false)
        setEncodedPolyline("")
        setResTravelOpt(null)
        navigate('/history', {state:{customer_id_state: data.customer_id, driver_id: data.driver.id}})
      }
    } catch (err) {
      console.error("Erro ao confirmar sua corrida:", err);
      setRequestSuccessful(false)
      setTravelInvalid({status: true, error: error})
    }
  };

  return (
    <APIProvider apiKey={"AIzaSyCFk_xK3gZ4dTWfAjkwR6wvKjKq2wuSH4g"}>
      <div className={`${requestSuccessful ? "max-w-screen-lg" : "max-w-screen-md"} m-auto flex items-center flex-col justify-center mt-5 py-6 px-8 md:p-0`}>
        <h1 className={`text-xl font-bold m-2 md:max-w-96 ${requestSuccessful && 'md:max-w-full' }`}>
          Preencha os dados abaixo para solicitar uma corrida.
        </h1>
        <TravelForm onSubmit={HandleSubmitTravel} requestSuccessful={requestSuccessful} loading={loading}/>

        {travelInvalid.status &&
          <span className="text-xl text-red-500 font-bold">{travelInvalid.error}</span>}
        {requestSuccessful &&  
         <>
            <RenderMap resTravelOpt={resTravelOpt} encodedPolyline={encodedPolyline}/>
            <div className="py-4">
              <h2 className="text-2xl font-bold m-2">Opções para a viagem:</h2>
              <>
              <div className="flex md:flex-row flex-col gap-6">
                {resTravelOpt?.options.map((option, index) => (
                    <DriverCard
                      key={index}
                      distance={resTravelOpt.distance}
                      duration={resTravelOpt.duration}
                      origin={formData?.origin as string}
                      destination={formData?.destination as string}
                      customer_id={formData?.customer_id as string}
                      {...option}
                      onSelect={handleSelectDriver}
                    />
                  ))}
                </div>
               </>
            </div>
         </>
        }
      </div>
    </APIProvider>
  );
}
