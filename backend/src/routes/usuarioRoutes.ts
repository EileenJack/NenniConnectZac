import { Router } from "express";
import {
  deleteUsuario,
  listUsuarios,
  loginUsuario,
  registerUsuario,
  updateUsuario,
} from "../controllers/userController";
import { jwtCheck } from "../middleware/auth";

const router = Router();

router.post("/registro", registerUsuario);
router.post("/login", loginUsuario);
router.get("/", jwtCheck, listUsuarios);
router.put("/:id", jwtCheck, updateUsuario);
router.delete("/:id", jwtCheck, deleteUsuario);

export default router;
