import { Request, Response } from "express";
import Negocio from "../models/negocioModel";

export const getAllNegocios = async (req: Request, res: Response) => {
  try {
    const { categoria, ubicacion, calificacionMin } = req.query;

    // Log para ver qué filtros llegan
    console.log("Filtros recibidos:", {
      categoria,
      ubicacion,
      calificacionMin,
    });

    let filter: any = {};
    if (categoria && categoria !== "") filter.categoria = categoria;
    if (ubicacion && ubicacion !== "") filter.ubicacion = ubicacion;
    if (calificacionMin && Number(calificacionMin) > 0)
      filter.calificacionPromedio = { $gte: Number(calificacionMin) };

    console.log("Filtro aplicado:", filter);

    const todosNegocios = await Negocio.find({});
    console.log("Total negocios en DB:", todosNegocios.length);
    console.log("Primer negocio:", todosNegocios[0]);

    const negocios = await Negocio.find(filter);
    console.log("Negocios después de filtro:", negocios.length);

    res.status(200).json(negocios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo negocios" });
  }
};
