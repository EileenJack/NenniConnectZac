// backend/src/models/userModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  auth0Id: string;
  email: string;
  name: string;
  rol: "cliente" | "emprendedor" | "admin";
  calificacionPromedio?: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    rol: {
      type: String,
      enum: ["cliente", "emprendedor", "admin"],
      default: "cliente",
    },
    calificacionPromedio: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
