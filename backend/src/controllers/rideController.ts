import { Request, Response } from "express";
import {
  getTravelsForUser,
  requestTravelToApi,
  saveTravelInDb,
} from "../services/rideService";


export const estimateTravel = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { origin, destination, custumer_id } = req.body;

  if (!origin || !destination || !custumer_id || origin === destination) {
    res
      .status(400)
      .json({
        error_code: "INVALID_DATA",
        error_description:
          "Os dados fornecidos no corpo da requisição são inválidos",
      });
    return;
  }
  try {
    const estimateTravelData = await requestTravelToApi(
      origin,
      destination,
      custumer_id
    );
    res.status(200).json(estimateTravelData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmTravel = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const getTravels = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { custumer_id } = req.params;
  const {driver_id} = req.query;

  if (custumer_id) {
    try {
      const rides = await getTravelsForUser(Number(custumer_id), Number(driver_id));
      if(rides){
        res.json({custumer_id, rides})
      }
    } catch (error:any) {
      res.status(error.status).json({error_code: error.error_code, error_description: error.error_description})
    }
  }else{
    res.status(500).json({message: "Paramêtro de url inválido, insira o id do usuário"})
  }
};
