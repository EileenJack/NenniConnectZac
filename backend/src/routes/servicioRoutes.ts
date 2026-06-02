import { Router } from "express";
import {
  createServicio,
  deleteServicio,
  getServicios,
  updateServicio,
} from "../controllers/servicioController";
import { jwtCheck } from "../middleware/auth";

const router = Router();

router.get("/", getServicios);
router.post("/", jwtCheck, createServicio);
router.put("/:id", jwtCheck, updateServicio);
router.delete("/:id", jwtCheck, deleteServicio);

export default router;
