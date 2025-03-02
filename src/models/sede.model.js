import mongoose from "mongoose";

const { model, Schema } = mongoose;

const sedeSchema = new Schema(
  {
    nombreSede: {
      type: String,
      required: [true, "El campo nombde de sede es requerido"],
    },
    ubiacion: {
      type: String,
      required: [true, "El campo ubicacion es requerido"],
    },
    activo: { type: Boolean, default:true },
    vehiculos: [{ type: Types.ObjectId, ref: "vehiculo" }], 
    conductores: [{ type: Types.ObjectId, ref: "conductor" }], 
    paquetes: [{ type: Types.ObjectId, ref: "paquete" }], 
    usuarios: [{ type: Types.ObjectId, ref: "usuario" }],
  },
  {
    timestamps: true,
  }
);

export const sedeModel = model("sede", sedeSchema);
