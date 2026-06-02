import mongoose, { Schema, Document } from "mongoose";

export interface INegocio extends Document {
  usuarioId?: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  categoria: string;
  telefono?: string;
  facebook?: string;
  instagram?: string;
  precioMinimo?: number;
  imagenUrl?: string;
  calificacionPromedio?: number;
  createdAt: Date;
  updatedAt: Date;
}

const negocioSchema: Schema<INegocio> = new Schema(
  {
    usuarioId: { type: Schema.Types.ObjectId, ref: "User" },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    ubicacion: { type: String, required: true },
    categoria: { type: String, required: true },
    telefono: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    precioMinimo: { type: Number, default: 0 },
    imagenUrl: { type: String },
    calificacionPromedio: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Negocio = mongoose.model<INegocio>("Negocio", negocioSchema);
export default Negocio;
