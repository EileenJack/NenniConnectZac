import mongoose, { Schema, Document } from "mongoose";

export interface IServicio extends Document {
  negocioId: mongoose.Types.ObjectId;
  nombre: string;
  descripcion?: string;
  precio: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const servicioSchema: Schema<IServicio> = new Schema(
  {
    negocioId: { type: Schema.Types.ObjectId, ref: "Negocio", required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Servicio = mongoose.model<IServicio>("Servicio", servicioSchema);
export default Servicio;
