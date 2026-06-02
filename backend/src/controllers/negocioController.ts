import { Request, Response } from "express";
import mongoose from "mongoose";
import Negocio from "../models/negocioModel";
import Servicio from "../models/servicioModel";
import Calificacion from "../models/calificacionModel";

const negocioPayload = (body: any, userId?: string) => ({
  usuarioId: body.id_usuario ?? body.usuarioId ?? userId,
  nombre: body.nombre ?? body.nombre_negocio,
  descripcion: body.descripcion,
  ubicacion: body.ubicacion,
  categoria: body.categoria ?? body.id_categoria,
  telefono: body.telefono,
  facebook: body.facebook,
  instagram: body.instagram,
  precioMinimo: Number(body.precioMinimo ?? body.precio ?? 0),
  imagenUrl: body.imagenUrl,
});

const missingNegocioFields = (payload: ReturnType<typeof negocioPayload>) => {
  const campos: string[] = [];
  if (!payload.usuarioId) campos.push("id_usuario");
  if (!payload.nombre) campos.push("nombre_negocio");
  if (!payload.categoria) campos.push("id_categoria");
  if (!payload.descripcion) campos.push("descripcion");
  if (!payload.ubicacion) campos.push("ubicacion");
  return campos;
};

export const createNegocio = async (req: Request, res: Response) => {
  try {
    const payload = negocioPayload(req.body, req.userId);
    const campos = missingNegocioFields(payload);

    if (campos.length > 0) {
      res.status(400).json({ error: "Faltan campos obligatorios", campos });
      return;
    }

    const negocio = await Negocio.create(payload);
    res.status(201).json({
      mensaje: "Negocio registrado correctamente",
      negocio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar negocio" });
  }
};

export const getAllNegocios = async (req: Request, res: Response) => {
  try {
    const {
      categoria,
      ubicacion,
      calificacion,
      calificacionMin,
      precio,
      precioMax,
      q,
      keyword,
    } = req.query;

    const filter: any = {};
    const searchTerm = String(q ?? keyword ?? "").trim();

    if (searchTerm) {
      filter.$or = [
        { nombre: { $regex: searchTerm, $options: "i" } },
        { descripcion: { $regex: searchTerm, $options: "i" } },
        { categoria: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (categoria) filter.categoria = { $regex: String(categoria), $options: "i" };
    if (ubicacion) filter.ubicacion = { $regex: String(ubicacion), $options: "i" };

    const minRating = Number(calificacion ?? calificacionMin ?? 0);
    if (minRating > 0) filter.calificacionPromedio = { $gte: minRating };

    const maxPrice = Number(precio ?? precioMax ?? 0);
    if (maxPrice > 0) filter.precioMinimo = { $lte: maxPrice };

    const negocios = await Negocio.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      mensaje: "Lista de negocios obtenida correctamente",
      negocios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo negocios" });
  }
};

export const getNegocioById = async (req: Request, res: Response) => {
  try {
    const negocioId = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(negocioId)) {
      res.status(404).json({ error: "No se encontro el negocio solicitado" });
      return;
    }

    const negocio = await Negocio.findById(negocioId);

    if (!negocio) {
      res.status(404).json({ error: "No se encontro el negocio solicitado" });
      return;
    }

    const [servicios, calificaciones] = await Promise.all([
      Servicio.find({ negocioId: negocio._id, activo: true }).sort({ createdAt: -1 }),
      Calificacion.find({ negocioId: negocio._id }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({ negocio, servicios, calificaciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo negocio" });
  }
};

export const updateNegocio = async (req: Request, res: Response) => {
  try {
    const negocioId = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(negocioId)) {
      res.status(404).json({ error: "No se encontro el negocio solicitado" });
      return;
    }

    const payload = negocioPayload(req.body, req.userId);
    const negocio = await Negocio.findByIdAndUpdate(negocioId, payload, {
      new: true,
      runValidators: true,
    });

    if (!negocio) {
      res.status(404).json({ error: "No se encontro el negocio solicitado" });
      return;
    }

    res.status(200).json({ mensaje: "Negocio actualizado correctamente", negocio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando negocio" });
  }
};

export const deleteNegocio = async (req: Request, res: Response) => {
  try {
    const negocioId = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(negocioId)) {
      res.status(404).json({ error: "No se encontro el negocio solicitado" });
      return;
    }

    const negocio = await Negocio.findByIdAndDelete(negocioId);

    if (!negocio) {
      res.status(404).json({ error: "No se encontro el negocio solicitado" });
      return;
    }

    await Promise.all([
      Servicio.deleteMany({ negocioId: negocio._id }),
      Calificacion.deleteMany({ negocioId: negocio._id }),
    ]);

    res.status(200).json({ mensaje: "Negocio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando negocio" });
  }
};
