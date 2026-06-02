import { Request, Response } from "express";
import Categoria from "../models/categoriaModel";

export const getCategorias = async (_req: Request, res: Response) => {
  try {
    const categorias = await Categoria.find({}).sort({ nombre: 1 });
    res.status(200).json({ mensaje: "Categorias obtenidas correctamente", categorias });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo categorias" });
  }
};

export const createCategoria = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body as { nombre?: string };

    if (!nombre) {
      res.status(400).json({ error: "Faltan campos obligatorios", campos: ["nombre"] });
      return;
    }

    const categoria = await Categoria.create({ nombre });
    res.status(201).json({ mensaje: "Categoria registrada correctamente", categoria });
  } catch (error: any) {
    if (error?.code === 11000) {
      res.status(400).json({ error: "La categoria ya existe" });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Error registrando categoria" });
  }
};
