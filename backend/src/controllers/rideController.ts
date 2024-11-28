import { Request, Response } from "express";
import {
  getDriversDB,
  getHistory,
  requestTravelToApi,
  saveTravelInDb,
} from "../services/rideService";


export const estimateTravel = async (req: Request,res: Response): Promise<void> => {
  
  const { origin, destination, customer_id } = req.body;

  if (!origin || !destination || !customer_id || origin === destination) {
    res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Os dados fornecidos no corpo da requisição são inválidos",
      });
    return;
  }

  try {
    const estimateTravelData = await requestTravelToApi(origin,destination);

    if(estimateTravelData.options.length < 1){
      res.status(202).json({error_description:"A sua solicitação foi concluída mas não encontrou moristas disponíveis para este trajeto, provavelmente o trajeto é muito curto"})
    }else{
      res.status(200).json(estimateTravelData);
    }
  } catch (error: any) {
    res.status(500).json({ error_description: error.message });
  }
};

export const confirmTravel = async (req: Request,res: Response): Promise<void> => {
  const travelData = req.body;

  if (travelData) {
    try {
      const confirmTravel = await saveTravelInDb(travelData);
      if (confirmTravel) res.status(200).json({ success: confirmTravel });
    } catch (error: any) {
      res.status(error.status).json(error);
    }
  }
};

export const getTravels = async (req: Request,res: Response): Promise<void> => {
  const { customer_id } = req.params;
  const {driver_id} = req.query;
  
  if (customer_id) {
    try {
      const rides = await getHistory(customer_id.toLocaleLowerCase(), Number(driver_id));
      if(rides){
        res.json({customer_id, rides})
      }
    } catch (error:any) {
      res.status(error.status).json({error_code: error.error_code, error_description: error.error_description})
    }
  }else{
    res.status(500).json({error_description: "Paramêtro de url inválido, insira o id do usuário"})
  }
};

export const getDrivers = async (req: Request, res: Response): Promise<void>=>{
  try {
    const dbDrivers = await getDriversDB();
    
    if(dbDrivers){
      const formatSelectDrivers = dbDrivers.map(driver => {
        return {
          driver_id: driver.id,
          driver_name: driver.name
        }
      })
      res.status(200).json(formatSelectDrivers)
    }
  } catch (error) {
    res.status(500).json({error_description: "Houve um erro ao recuperar informações dos motoristas"})
  }
}