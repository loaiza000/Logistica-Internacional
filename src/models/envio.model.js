import mongoose from "mongoose";

const { model, Shcema } = mongoose;

const envioSchema = new Shcema(
  {
    origen: { type: String, required: [true, "El campo origen es requerido"] },
    destino: {
      type: String,
      required: [true, "El campo destino es requerido"],
    },
    peso: {
      type: Number,
      required: [true, "El campo peso es requerido"],
      minlenght: 1,
    },
    volumen: {
      type: Number,
      required: [true, "El campo volumen es requerido"],
      minlenght: 1,
    },
    tipoMercancia: {
      type: String,
      required: [true, "El campo tipo mercancia es requerido"],
      enum:["Documentos", "Paquetes", "Delicado"],
      default:"Paquetes"
    },
    // ** NUEVOOOOOOOOOOOOOOOOOOOO
    tipoEnvio: {
      type: String,
      enum: ["Nacional", "Internacional"],
      default: "Nacional",
    },
    numeroEnvio: {
      type: String,
      required: [true, "El campo numero de envio es requerido"],
      unique: true,
    },
    estado: {
      type: String,
      required: [true, "El campo estado es requerido"],
      enum: ["Pendiente", "Entregado", "En camino", "Cancelado"],
      default: "Pendiente",
    },
    costo: { type: Number },
    activo: { type: Boolean, default: true },
    vehiculo: { type: mongoose.Types.ObjectId, ref: "vehiculo" },
    conductor: { type: mongoose.Types.ObjectId, ref: "conductor" },
  },

  {
    timestamps: true,
  }
);

export const envioModel = model("envio", envioSchema);
