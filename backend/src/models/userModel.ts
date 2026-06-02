// backend/src/models/userModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  auth0Id: string;
  email: string;
  name: string;
  usuario?: string;
  passwordHash?: string;
  passwordSalt?: string;
  rol: "cliente" | "emprendedor" | "admin";
  bloqueado?: boolean;
  calificacionPromedio?: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    auth0Id: { type: String, required: false, unique: true, sparse: true },
    email: { type: String, required: true },
    usuario: { type: String },
    passwordHash: { type: String },
    passwordSalt: { type: String },
    name: { type: String, required: true },
    rol: {
      type: String,
      enum: ["cliente", "emprendedor", "admin"],
      default: "cliente",
    },
    bloqueado: { type: Boolean, default: false },
    calificacionPromedio: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
