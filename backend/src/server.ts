import express, {Request, Response} from 'express';
import RideRouters from './routes';


const app = express();
app.use(express.json())

app.use('/ride', RideRouters)

app.use('/', async (req:Request, res:Response)=>{
  res.json({message: "Hello World! 1"})
})

app.listen(process.env.PORT || 8080, ()=> `Server running on port ${process.env.PORT}`)
