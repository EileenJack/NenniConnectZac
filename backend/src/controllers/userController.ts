import { Request, Response } from "express";
import User from "../models/userModel";

// Crear o verificar usuario en Atlas
export const createUser = async (req: Request, res: Response) => {
  const { auth0Id, email, name } = req.body;

  try {
    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = await User.create({ auth0Id, email, name, rol: "cliente" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando/verificando usuario" });
  }
};
