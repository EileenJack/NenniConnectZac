import mongoose, { Schema, Document } from "mongoose";

export interface ICalificacion extends Document {
  usuarioId: mongoose.Types.ObjectId;
  negocioId: mongoose.Types.ObjectId;
  puntuacion: number;
  comentarios?: string;
  createdAt: Date;
  updatedAt: Date;
}

const calificacionSchema: Schema<ICalificacion> = new Schema(
  {
    usuarioId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    negocioId: { type: Schema.Types.ObjectId, ref: "Negocio", required: true },
    puntuacion: { type: Number, required: true, min: 1, max: 5 },
    comentarios: { type: String },
  },
  { timestamps: true },
);

const Calificacion = mongoose.model<ICalificacion>(
  "Calificacion",
  calificacionSchema,
);
export default Calificacion;
