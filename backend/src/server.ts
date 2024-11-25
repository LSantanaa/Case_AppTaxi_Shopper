import express, {NextFunction, Request, Response} from 'express';
import RideRouters from './routes';
import { PORT } from './config/env';

const app = express();
app.use(express.json())

app.use('/ride', RideRouters)

app.use((req: Request, res: Response, next: NextFunction)=>{
  res.status(404).json({
    error_code: "NOT_FOUND",
    error_description: "Esta rota está inacessível ou não foi encontrada."
  })
})

app.use((err:Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))
