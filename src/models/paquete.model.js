import mongoose from "mongoose";

const { model, Schema } = mongoose;

const paqueteSchema = new Schema(
  {
    descripcion: {
      type: String,
      required: [true, "El campo descripción es requerido"],
    },
    peso: {
      type: Number,
      required: [true, "El campo peso es requerido"],
    },
    dimensiones: {
      largo: { type: Number, required: [true, "El campo largo es requerido"] },
      ancho: { type: Number, required: [true, "El campo ancho es requerido"] },
      alto: { type: Number, required: [true, "El campo alto es requerido"] },
    },
    estado: {
      type: String,
      enum: ["Pendiente", "En tránsito", "Entregado", "Devuelto"],
      default: "Pendiente",
    },
    activo: { type: Boolean, default:true },
    sku: { type: String },
    envioAsignado: {
      type: mongoose.Types.ObjectId,
      ref: "envio",
    },
    sede: { type: mongoose.Types.ObjectId, ref: "sede" },
  },
  {
    timestamps: true,
  }
);

export const paqueteModel = model("paquete", paqueteSchema);
