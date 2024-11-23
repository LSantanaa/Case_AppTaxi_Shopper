import { Request, Response } from 'express';
import { computeRoute } from '../services/rideService';

export const estimate = async (req: Request, res: Response): Promise<void> => {
  const { origin, destination, costumerId } = req.body;

  if (!origin || !destination || !costumerId) {
    res.status(400).json({ error_code: 'INVALID_DATA',error_description: 'Os campos de origem, destino e usuário devem estar preenchidos' });
    return;
  }

  try {
    const routeData = await computeRoute(origin, destination, costumerId);
    res.status(200).json(routeData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
