import mongoose from "mongoose";

const { model, Schema } = mongoose;

const conductorShcema = new Schema(
  {
    nombre: { type: String, required: [true, "El campo nombre es requerido"] },
    apellido: {
      type: String,
      required: [true, "El campo apellido es requerido"],
    },
    numeroCelular: {
      type: Number,
      required: [true, "El campo numero de celular es requerido"],
      unique: true,
    },
    cc: {
      type: String,
      required: [true, "El campo C.C es requerido"],
      unique: true,
    },
    estado: {
      type: String,
      enum: ["Suspendido", "Ocupado", "Disponible"],
      default: "Activo",
    },
    direccion: {
      type: String,
      required: [true, "El campo dirección es requerido"],
    },
    activo: { type: Boolean, default: true },
    historialEnvios: [{ type: mongoose.Types.ObjectId, ref: "envio" }],
    vehiculo: { type: mongoose.Types.ObjectId, ref: "vehiculo" },
    sede: { type: mongoose.Types.ObjectId, ref: "sede" },
  },

  {
    timestamps: true,
  }
);

export const conductorModel = model("conductor", conductorShcema);
