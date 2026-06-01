import mongoose, { Schema, Document } from "mongoose";

export interface INegocio extends Document {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  categoria: string;
  imagenUrl?: string;
  calificacionPromedio?: number;
  createdAt: Date;
  updatedAt: Date;
}

const negocioSchema: Schema<INegocio> = new Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    ubicacion: { type: String, required: true },
    categoria: { type: String, required: true },
    imagenUrl: { type: String },
    calificacionPromedio: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Negocio = mongoose.model<INegocio>("Negocio", negocioSchema);
export default Negocio;
