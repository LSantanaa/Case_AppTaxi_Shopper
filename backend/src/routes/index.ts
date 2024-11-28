import { Router } from "express";
import * as RideController from '../controllers/rideController'

const RideRouters = Router();

RideRouters.post('/estimate', RideController.estimateTravel)
RideRouters.patch('/confirm', RideController.confirmTravel)
RideRouters.get('/:customer_id', RideController.getTravels)
RideRouters.get('/drivers/data', RideController.getDrivers)

export default RideRouters;