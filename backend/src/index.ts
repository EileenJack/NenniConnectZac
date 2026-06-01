import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import negocioRoutes from "./routes/negocioRoutes";
import { jwtCheck, jwtParse } from "./middleware/auth";

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

app.use("/api/users", jwtCheck, jwtParse, userRoutes);
app.use("/api/negocios", jwtCheck, jwtParse, negocioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server corriendo en puerto ${PORT}`));
