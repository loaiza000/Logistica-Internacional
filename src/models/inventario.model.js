import mongoose from "mongoose";

const { Schema, model } = mongoose;

const inventarioSchema = new Schema(
  {
    nombre: { type: String, required: [true, "El campo nombre es requerido"] },
    cantidad: {
      type: Number,
      required: [true, "El campo cantidad es requerido"],
      min: 0,
    },
    unidadMedida: {
      type: String,
      enum: ["kg", "g", "lb", "unidad"],
      required: [true, "El campo unidad de medida es requerido"],
    },
    categoria: {
      type: String,
      required: [true, "El campo categoria es requerido"],
    },
    estado: {
      type: String,
      enum: ["disponible", "agotado", "reservado"],
      default: "disponible",
    },
    fechaIngreso: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true },
    sede: { type: mongoose.Schema.Types.ObjectId, ref: "sede" },
  },
  {
    timestamps: true,
  }
);

export const inventarioModel = model("inventario", inventarioSchema);
