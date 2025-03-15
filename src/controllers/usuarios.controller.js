import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { usuarioModel } from "../models/usuario.model.js";
import { encryptPassword } from "../helpers/password.encrypt.js";
import { generateToken } from "../helpers/generate.token.js";
import { response } from "../helpers/response.js";
import { sedeModel } from "../models/sede.model.js";
import bcrypt from "bcrypt"

const usaurioController = {};

usaurioController.getAllUsers = async (req, res) => {
  try {
    const users = await usuarioModel
      .find()
      .populate("sede", "nombreSede ubiacion");
    if (users.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "La lista de usuarios aun esta vacia"
      );
    }
    return response(res, 200, true, users, "Lista de usuarios");
  } catch (error) {
    return handleError(res, error);
  }
};

usaurioController.getUseryId = async (req, res) => {
  try {
    const { idUser } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idUser)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idUser} no es valido para la base de datos`
      );
    }

    const userFound = await usuarioModel
      .findById({ _id: idUser })
      .populate("sede", "nombreSede ubiacion");
    if (!userFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    return response(res, 200, true, userFound, "Usuario encontrado");
  } catch (error) {
    return handleError(res, error);
  }
};

usaurioController.postUsuario = async (req, res) => {
  try {
    const {
      cc,
      numeroCelular,
      rol,
      email,
      password,
      nombre,
      sede,
      direccion,
      fechaNacimiento,
    } = req.body;

    const ccDuplicado = await usuarioModel.findOne({ cc: cc });
    if (ccDuplicado) {
      return response(
        res,
        400,
        false,
        "",
        `El C.C ${cc} ya se encuentra en uso`
      );
    }

    const numeroDuplicado = await usuarioModel.findOne({
      numeroCelular: numeroCelular,
    });
    if (numeroDuplicado) {
      return response(
        res,
        400,
        false,
        "",
        `El numero de celular ${numeroCelular} ya se encuentra en uso`
      );
    }

    const emailDuplicado = await usuarioModel.findOne({ email: email });
    if (emailDuplicado) {
      return response(
        res,
        400,
        false,
        "",
        `El email ${email} ya se encuentra en uso`
      );
    }

    if (!mongoose.Types.ObjectId.isValid(sede)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${sede} no es valido para la base de datos`
      );
    }
    const sedeFound = await sedeModel.findById({ _id: sede });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `Sede no encontrada con el id ${id}`
      );
    }

    if (!password || password.length < 5) {
      return response(
        res,
        400,
        false,
        "",
        "El password debe ser mayor a 5 caracteres"
      );
    }

    if (!numeroCelular || numeroCelular.length < 5) {
      return response(
        res,
        400,
        false,
        "",
        "El mumero de celular no puede ser menor a 5 digitos"
      );
    }

    if (rol != "usuario".toLowerCase()) {
      return response(
        res,
        400,
        false,
        "",
        "Solo se puede registrar como usuario, si desea registrase con otro rol porfavor comunicarse con un administrador"
      );
    }

    const encryptarPassword = encryptPassword(password);
    const newUser = new usuarioModel({
      nombre,
      email,
      password: encryptarPassword,
      cc,
      sede,
      numeroCelular,
      direccion,
      rol: "Cliente",
      fechaNacimiento,
    });
    const token = generateToken({ user: newUser._id });
    newUser.token = token;
    await newUser.save();
    return response(
      res,
      201,
      true,
      { ...newUser._doc, password: null },
      "Usuario creado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** SAVE ADMINS

usaurioController.postAdmin = async (req, res) => {
  try {
    const {
      cc,
      numeroCelular,
      rol,
      email,
      password,
      nombre,
      sede,
      direccion,
      fechaNacimiento,
    } = req.body;

    const ccDuplicado = await usuarioModel.findOne({ cc: cc });
    if (ccDuplicado) {
      return response(
        res,
        400,
        false,
        "",
        `El C.C ${cc} ya se encuentra en uso`
      );
    }

    const numeroDuplicado = await usuarioModel.findOne({
      numeroCelular: numeroCelular,
    });
    if (numeroDuplicado) {
      return response(
        res,
        400,
        false,
        "",
        `El numero de celular ${numeroCelular} ya se encuentra en uso`
      );
    }

    const emailDuplicado = await usuarioModel.findOne({ email: email });
    if (emailDuplicado) {
      return response(
        res,
        400,
        false,
        "",
        `El email ${email} ya se encuentra en uso`
      );
    }

    if (!mongoose.Types.ObjectId.isValid(sede)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${sede} no es valido para la base de datos`
      );
    }
    const sedeFound = await sedeModel.findById({ _id: sede });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `Sede no encontrada con el id ${id}`
      );
    }

    if (!password || password.length < 5) {
      return response(
        res,
        400,
        false,
        "",
        "El password debe ser mayor a 5 caracteres"
      );
    }

    if (!password || password.length < 5) {
      return response(
        res,
        400,
        false,
        "",
        "El password debe ser mayor a 5 caracteres"
      );
    }

    if (!numeroCelular || numeroCelular.length < 5) {
      return response(
        res,
        400,
        false,
        "",
        "El mumero de celular no puede ser menor a 5 digitos"
      );
    }

    const encryptarPassword = encryptPassword(password);
    const newUser = new usuarioModel({
      nombre,
      email,
      password: encryptarPassword,
      cc,
      numeroCelular,
      direccion,
      sede,
      rol,
      fechaNacimiento,
    });
    const token = generateToken({ user: newUser._id });
    newUser.token = token;
    await newUser.save();
    return response(
      res,
      201,
      true,
      { ...newUser._doc, password: null },
      "Usuario creado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

usaurioController.putUsuario = async (req, res) => {
  try {
    const { idUser } = req.params;
    const {
      cc,
      numeroCelular,
      rol,
      email,
      password,
      nombre,
      sede,
      direccion,
      fechaNacimiento,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idUser)) {
      `El id ${idUser} no es valido para la base de datos`;
    }

    const userFound = await usuarioModel.findById({ _id: id });
    if (!userFound) {
      return response(
        res,
        404,
        false,
        "",
        `Usuario no encontrado con el id ${idUser}`
      );
    }

    if (!cc || userFound.cc != cc) {
      const ccDuplicado = await usuarioModel.findOne({ cc: cc });
      if (ccDuplicado) {
        return response(
          res,
          400,
          false,
          "",
          `El C.C ${cc} ya se encuentra en uso`
        );
      }
    }

    if (!numeroCelular || userFound.numeroCelular != numeroCelular) {
      const numeroDuplicado = await usuarioModel.findOne({
        numeroCelular: numeroCelular,
      });
      if (numeroDuplicado) {
        return response(
          res,
          400,
          false,
          "",
          `El numero de celular ${numeroCelular} ya se encuentra en uso`
        );
      }
    }

    if (!email || userFound.email != email) {
      const emailDuplicado = await usuarioModel.findOne({ email: email });
      if (emailDuplicado) {
        return response(
          res,
          400,
          false,
          "",
          `El email ${email} ya se encuentra en uso`
        );
      }
    }

    if (!mongoose.Types.ObjectId.isValid(sede)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${sede} no es valido para la base de datos`
      );
    }

    if (!sede || userFound.sede != sede) {
      const sedeFound = await sedeModel.findById({ _id: sede });
      if (!sedeFound) {
        return response(
          res,
          404,
          false,
          "",
          `Sede no encontrada con el id ${id}`
        );
      }

      if (!password || password.length < 5) {
        return response(
          res,
          400,
          false,
          "",
          "El password debe ser mayor a 5 caracteres"
        );
      }
    }

    if (!password || password.length < 5) {
      return response(
        res,
        400,
        false,
        "",
        "El password debe ser mayor a 5 caracteres"
      );
    }

    if (!numeroCelular || numeroCelular.length < 5) {
      return response(
        res,
        400,
        false,
        "",
        "El mumero de celular no puede ser menor a 5 digitos"
      );
    }

    if (rol != "usuario".toLowerCase()) {
      return response(
        res,
        400,
        false,
        "",
        "Solo se puede registrar como usuario, si desea registrase con otro rol porfavor comunicarse con un administrador"
      );
    }

    const updatedUser = await usuarioModel.findByIdAndUpdate(
      idUser,
      {
        cc,
        numeroCelular,
        email,
        nombre,
        direccion,
        fechaNacimiento,
        rol: rol ? rol.toLowerCase() : userFound.rol,
      },
      { new: true }
    );

    return response(
      res,
      201,
      true,
      { ...updatedUser._doc, password: null },
      "Usuario actualizado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

usaurioController.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const userFound = await usuarioModel.findById({ _id: id });
    if (!userFound) {
      return response(res, 404, false, "", "Usuario no encontrado");
    }

    userFound.activo = false;
    await userFound.save();

    return response(res, 400, false, userFound, "Usuario desactivado");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET USER BY NAME

usaurioController.getUserNombre = async (req, res) => {
  try {
    const { nombre } = req.params;

    const usersFound = await usuarioModel.find({ nombre: nombre });
    if (usersFound.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontraron usuario con el nombre ${nombre}`
      );
    }

    return response(
      res,
      200,
      true,
      usersFound,
      `Lista de usuario con el nombre ${nombre}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET USERS ACTIVE

usaurioController.usersActive = async (req, res) => {
  try {
    const userActive = await usuarioModel.find({ activo: true });
    if (userActive.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron usuarios activos"
      );
    }

    return response(res, 200, true, "", "Lista de usuarios activos");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET USERS INACTIVE

usaurioController.userInactive = async (req, res) => {
  try {
    const userInactive = await usuarioModel.find({ activo: false });
    if (userInactive.length === 0) {
      return response(res, 404, false, "", "No hay usaurios inactivos");
    }

    return response(res, 200, true, "", "Lista de usuarios inactivos");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** LOGIN

usaurioController.looginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await usuarioModel.findOne({ email: email });
    if (!usuario) {
      return response(res, 404, false, "", "Email no registrado o encontrado");
    }

    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return response(res, 400, false, "", "Password incorrecto");
    }

    const token = generateToken({
      id: usuario._id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return response({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        sede: usuario.sede,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export default usaurioController;
