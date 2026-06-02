import { Router } from "express";
import {
  createNegocio,
  deleteNegocio,
  getAllNegocios,
  getNegocioById,
  updateNegocio,
} from "../controllers/negocioController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = Router();

router.get("/", getAllNegocios);
router.get("/:id", getNegocioById);
router.post("/", jwtCheck, jwtParse, createNegocio);
router.put("/:id", jwtCheck, jwtParse, updateNegocio);
router.delete("/:id", jwtCheck, jwtParse, deleteNegocio);

export default router;
