import mongoose from "mongoose";

const { Schema, model } = mongoose;

const pagosSchema = new Schema(
  {
    monto: {
      type: Number,
      required: [true, "El campo monto es requerido"],
      default: 0,
    },
    estado: {
      type: String,
      enum: ["pendiente", "pagado", "cancelado"],
      default: "pendiente",
    },
    metodoPago: {
      type: String,
      enum: ["efectivo", "tarjeta", "transferencia", "paypal"],
      required: [true, "El método de pago es obligatorio"],
    },
    fechaPago: { type: Date },
    activo: { type: Boolean, default: true },
    nombreFactura: {
      type: mongoose.Types.ObjectId,
      ref: "usuario",
      required: [true, "El campo usuario para registrar el pago es requerido"],
    },
  },
  {
    timestamps: true,
  }
);

export const pagosModel = model("pagos", pagosSchema);
