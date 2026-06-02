import { Request, Response } from "express";
import Servicio from "../models/servicioModel";
import Negocio from "../models/negocioModel";

const servicioPayload = (body: any) => ({
  negocioId: body.id_negocio ?? body.negocioId,
  nombre: body.nombre ?? body.nombre_servicio,
  descripcion: body.descripcion,
  precio: Number(body.precio),
  activo: body.activo ?? true,
});

export const createServicio = async (req: Request, res: Response) => {
  try {
    const payload = servicioPayload(req.body);
    const campos: string[] = [];
    if (!payload.negocioId) campos.push("id_negocio");
    if (!payload.nombre) campos.push("nombre_servicio");
    if (!Number.isFinite(payload.precio)) campos.push("precio");

    if (campos.length > 0) {
      res.status(400).json({ error: "Faltan campos obligatorios", campos });
      return;
    }

    const servicio = await Servicio.create(payload);
    await Negocio.findByIdAndUpdate(payload.negocioId, {
      $min: { precioMinimo: payload.precio },
    });

    res.status(201).json({ mensaje: "Servicio publicado correctamente", servicio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error publicando servicio" });
  }
};

export const getServicios = async (req: Request, res: Response) => {
  try {
    const { id_negocio, negocioId, nombre_servicio, precio } = req.query;
    const filter: any = {};

    if (id_negocio || negocioId) filter.negocioId = id_negocio ?? negocioId;
    if (nombre_servicio) {
      filter.nombre = { $regex: String(nombre_servicio), $options: "i" };
    }
    if (precio && Number(precio) > 0) filter.precio = { $lte: Number(precio) };

    const servicios = await Servicio.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ mensaje: "Servicios obtenidos correctamente", servicios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo servicios" });
  }
};

export const updateServicio = async (req: Request, res: Response) => {
  try {
    const servicio = await Servicio.findByIdAndUpdate(
      req.params.id,
      servicioPayload(req.body),
      { new: true, runValidators: true },
    );

    if (!servicio) {
      res.status(404).json({ error: "Servicio no encontrado" });
      return;
    }

    res.status(200).json({ mensaje: "Servicio actualizado correctamente", servicio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando servicio" });
  }
};

export const deleteServicio = async (req: Request, res: Response) => {
  try {
    const servicio = await Servicio.findByIdAndDelete(req.params.id);

    if (!servicio) {
      res.status(404).json({ error: "Servicio no encontrado" });
      return;
    }

    res.status(200).json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando servicio" });
  }
};
