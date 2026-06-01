import { Router } from "express";
import { getAllNegocios } from "../controllers/negocioController";

const router = Router();

router.get("/negocios", getAllNegocios);

export default router;
