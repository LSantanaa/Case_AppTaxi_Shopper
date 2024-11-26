import express, { NextFunction, Request, Response } from "express";
import RideRouters from "./routes";
import { PORT } from "./config/env";
import cors from "cors";
import seedDriversDb from "./db/seed";


const startServer = async () => {

  /**
   * chama o seed de motoristas para a database
   */
  console.log('Inserindo dados no banco')
  await seedDriversDb().catch(error => console.error("Um erro ocorreu ao tentar inserir os dados: ", error))

  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use("/ride", RideRouters);

  /**Middleware para rotas não permitidas/inacessíveis */
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
      error_code: "NOT_FOUND",
      error_description: "Esta rota está inacessível ou não foi encontrada.",
    });
  });

  /**Middleware para possíveis erros no express */
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
