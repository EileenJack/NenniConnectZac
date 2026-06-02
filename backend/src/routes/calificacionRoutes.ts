import { Router } from "express";
import {
  createCalificacion,
  getCalificacionesByNegocio,
} from "../controllers/calificacionController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = Router();

router.post("/", jwtCheck, jwtParse, createCalificacion);
router.get("/:idNegocio", getCalificacionesByNegocio);

export default router;
