import { Router } from "express";
import {
  createUser,
  getUser,
  registerAuth0User,
} from "../controllers/userController";

const router = Router();

router.get("/", getUser);
router.post("/register", registerAuth0User);
router.post("/", createUser);

export default router;
