import { Request, Response } from "express";
import mongoose from "mongoose";
import Calificacion from "../models/calificacionModel";
import Negocio from "../models/negocioModel";

const updateAverage = async (negocioId: string) => {
  const negocioObjectId = new mongoose.Types.ObjectId(negocioId);
  const stats = await Calificacion.aggregate([
    { $match: { negocioId: negocioObjectId } },
    { $group: { _id: "$negocioId", promedio: { $avg: "$puntuacion" } } },
  ]);
  const promedio = stats[0]?.promedio ?? 0;
  await Negocio.findByIdAndUpdate(negocioId, {
    calificacionPromedio: Math.round(promedio * 10) / 10,
  });
};

export const createCalificacion = async (req: Request, res: Response) => {
  try {
    const negocioId = req.body.id_negocio ?? req.body.negocioId;
    const puntuacion = Number(req.body.puntuacion);
    const comentarios = req.body.comentarios;
    const usuarioId = req.userId ?? req.body.id_usuario;
    const campos: string[] = [];

    if (!usuarioId) campos.push("id_usuario");
    if (!negocioId) campos.push("id_negocio");
    if (!Number.isFinite(puntuacion) || puntuacion < 1 || puntuacion > 5) {
      campos.push("puntuacion");
    }

    if (campos.length > 0) {
      res.status(400).json({ error: "Faltan campos obligatorios", campos });
      return;
    }

    const calificacion = await Calificacion.create({
      usuarioId,
      negocioId,
      puntuacion,
      comentarios,
    });

    await updateAverage(negocioId);
    res.status(201).json({ mensaje: "Calificacion registrada correctamente", calificacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registrando calificacion" });
  }
};

export const getCalificacionesByNegocio = async (req: Request, res: Response) => {
  try {
    const calificaciones = await Calificacion.find({
      negocioId: req.params.idNegocio,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      mensaje: "Calificaciones obtenidas correctamente",
      calificaciones,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo calificaciones" });
  }
};
