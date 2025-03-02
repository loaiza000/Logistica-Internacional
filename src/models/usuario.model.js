import mongoose, { Schema } from "mongoose";

const { model, Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: [true, "El campo nombre es requerido"] },
    apellido: {
      type: String,
      required: [true, "El campo apellido es requerido"],
    },
    email: {
      type: String,
      required: [true, "El campo email es requerido"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "El campo password es requerido"],
    },
    activo: {
      type: Boolean,
      required: [true, "El campo activo es requerido"],
      default: true,
    },
    cc: {
      type: String,
      required: [true, "El campo C.C es requerido"],
      minlength: [5, "El campo C.C debe tener al menos 5 caracteres"],
      unique: true,
    },
    numeroCelular: {
      type: Number,
      required: [true, "El campo numero de celular es requerido"],
    },
    direccion: {
      type: String,
      required: [true, "El campo direccion es requerido"],
    },
    rol: {
      type: String,
      required: [true, "El campo rol es requerido"],
      enum: ["Administrador", "Operador" ],
      default: "Cliente",
    },
    fechaNacimiento: {
      type: Date,
      required: [true, "El campo fecha de nacimioento es requerido"],
    },
    token: { type: String },
    sede: { type: mongoose.Types.ObjectId, ref: "sede" },
  },
  {
    timestamps: true,
  }
);

export const usuarioModel = model("usuario", usuarioSchema);
