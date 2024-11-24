import { Router } from "express";
import * as RideController from '../controllers/rideController'

const RideRouters = Router();

RideRouters.post('/estimate', RideController.estimateTravel)
RideRouters.patch('/confirm', RideController.confirmTravel)
RideRouters.get('/:custumer_id', RideController.getTravels)

export default RideRouters;