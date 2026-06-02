import { Router } from "express";
import {
  createCategoria,
  getCategorias,
} from "../controllers/categoriaController";
import { jwtCheck } from "../middleware/auth";

const router = Router();

router.get("/", getCategorias);
router.post("/", jwtCheck, createCategoria);

export default router;
