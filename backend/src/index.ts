import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import usuarioRoutes from "./routes/usuarioRoutes";
import negocioRoutes from "./routes/negocioRoutes";
import servicioRoutes from "./routes/servicioRoutes";
import categoriaRoutes from "./routes/categoriaRoutes";
import calificacionRoutes from "./routes/calificacionRoutes";
import { jwtCheck } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((e) => {
    console.log("Error al conectar");
    console.log(e);
  });

app.get("/test", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente" });
});

app.use("/api/user", jwtCheck, userRoutes);
app.use("/api/users", jwtCheck, userRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/negocios", negocioRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/calificaciones", calificacionRoutes);

app.use(
  (
    err: Error & { status?: number; statusCode?: number },
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (
      err.status === 401 ||
      err.statusCode === 401 ||
      err.name === "UnauthorizedError"
    ) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    next(err);
  },
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server corriendo en puerto ${PORT}`));
