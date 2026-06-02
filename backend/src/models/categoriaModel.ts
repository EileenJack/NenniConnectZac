import mongoose, { Schema, Document } from "mongoose";

export interface ICategoria extends Document {
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}

const categoriaSchema: Schema<ICategoria> = new Schema(
  {
    nombre: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const Categoria = mongoose.model<ICategoria>("Categoria", categoriaSchema);
export default Categoria;
