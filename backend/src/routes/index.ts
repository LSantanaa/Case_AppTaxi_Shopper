import { Router } from "express";
import * as RideController from '../controllers/rideController'

const RideRouters = Router();

RideRouters.post('/estimate', RideController.estimate)

export default RideRouters;