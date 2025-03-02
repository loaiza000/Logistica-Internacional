import mongoose from "mongoose";

const { model, Schema } = mongoose;

const vehiculoSchema = new Schema(
  {
    tipo: {
      type: String,
      enum: ["Camion", "Automovil"],
      required: true,
    },
    placa: {
      type: String,
      unique: true,
      required: true,
    },
    marca: {
      type: String,
      required: true,
    },
    modelo: {
      type: String,
      required: true,
    },
    anio: {
      type: Number,
      required: true,
    },
    capacidadCarga: {
      type: Number,
      required: true,
    },
    dimensionesCarga: {
      largo: { type: Number, required: true },
      ancho: { type: Number, required: true },
      alto: { type: Number, required: true },
    },
    estado: {
      type: String,
      enum: ["Disponible", "En ruta", "Mantenimiento"],
      default: "Disponible",
    },
    activo: { type: Boolean, default:true },
    conductorAsignado: {
      type: mongoose.Types.ObjectId,
      ref: "conductor",
    },
    sede: { type: mongoose.Types.ObjectId, ref: "sede" },
  },
  {
    timestamps: true,
  }
);

export const vehiculoModel = model("vehiculo", vehiculoSchema);
