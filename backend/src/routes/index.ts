import { Router } from "express";
import * as RideController from '../controllers/index'

const RideRouters = Router();

RideRouters.get('/estimate', RideController.estimate)

export default RideRouters;