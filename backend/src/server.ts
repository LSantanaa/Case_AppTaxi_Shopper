import express, {NextFunction, Request, Response} from 'express';
import RideRouters from './routes';
import { PORT } from './config/env.';

const app = express();
app.use(express.json())

app.use('/ride', RideRouters)

app.use('/', async (req:Request, res:Response)=>{
  res.json({message: "Hello World!"})
})

app.use((err:Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
