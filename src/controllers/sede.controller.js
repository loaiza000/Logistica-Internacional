import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { sedeModel } from "../models/sede.model.js";
import { vehiculoModel } from "../models/vehiculo.model.js";
import { conductorModel } from "../models/conductores.model.js";
import { paqueteModel } from "../models/paquete.model.js";
import { usuarioModel } from "../models/usuario.model.js";

const sedeController = {};

sedeController.getAllSedes = async (req, res) => {
  try {
    const sedes = await sedeModel.find();
    if (sedes.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron sedes registradas"
      );
    }

    return response(res, 200, true, "", "Lista de sedes registradas ");
  } catch (error) {
    return handleError(res, error);
  }
};

sedeController.getSedeById = async (req, res) => {
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

    const sedeFound = await sedeModel.findById({ _id: id });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `Sede no encontrada con el id ${id}`
      );
    }

    return response(
      res,
      200,
      true,
      sedeFound,
      `Sede encontrada con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

sedeController.postSede = async (req, res) => {
  try {
    const { nombreSede, ubicacion } = req.body;

    if (!nombreSede || !ubicacion) {
      return response(
        res,
        400,
        false,
        "",
        "El nombre de la sede y la ubicacion es requerido"
      );
    }

    const nombreSedeFound = await sedeModel.findOne({ nombreSede: nombreSede });
    if (nombreSedeFound) {
      return response(
        res,
        400,
        false,
        "",
        `El nombre de la sede ${nombreSede} ya esta en uso y debe ser unico`
      );
    }

    const nuevaSede = await sedeModel.create(req.body);
    return response(res, 201, true, nuevaSede, "Sede creada con exito");
  } catch (error) {
    return handleError(res, error);
  }
};

sedeController.putSede = async (req, res) => {
  try {
    const { nombreSede, ubicacion } = req.body;
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

    const sedeFound = await sedeModel.findById({ _id: id });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `Sede no encontrada con el id ${id}`
      );
    }

    if (!nombreSede || !ubicacion) {
      return response(
        res,
        400,
        false,
        "",
        "El nombre de la sede y la ubicacion es requerido"
      );
    }

    if (!sedeFound || sedeFound.nombreSede != nombreSede) {
      const nombreSedeFound = await sedeModel.findOne({
        nombreSede: nombreSede,
      });
      if (nombreSedeFound) {
        return response(
          res,
          400,
          false,
          "",
          `El nombre de la sede ${nombreSede} ya esta en uso y debe ser unico`
        );
      }
    }

    const sedeUpdate = await sedeFound.updateOne(req.body);
    return response(res, 200, true, sedeUpdate, "Sede actualizada con exito");
  } catch (error) {
    return handleError(res, error);
  }
};

sedeController.deleteSede = async (req, res) => {
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

    const sedeFound = await sedeModel.findById({ _id: id });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `Sede no encontrada con el id ${id}`
      );
    }

    await sedeFound.updateOne({ activo: false });
    return response(
      res,
      200,
      true,
      "",
      `La sede con el id ${id} fue desactivada con exito`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** SEDES INACTIVAS

sedeController.getSedesInactivas = async (req, res) => {
  try {
    const sedesInactivas = await sedeModel.find({ activo: false });
    if (sedesInactivas.length === 0) {
      return response(res, 404, false, "", "No se encontraron sedes inactivas");
    }

    return response(res, 200, true, sedesInactivas, "Sedes inactivas");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** SEDES ACTIVAS

sedeController.getSedesActivas = async (req, res) => {
  try {
    const sedesActivas = await sedeModel.find({ activo: true });
    if (sedesActivas.length === 0) {
      return response(res, 404, false, "", "No se encontraron sedes activas");
    }

    return response(res, 200, true, sedesActivas, "Sedes activas");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** FOUND SEDE BY NOMBRE

sedeController.getSedeByNombre = async (req, res) => {
  try {
    const { nombre } = req.body;

    const sedeByNombre = await sedeModel.findOne({ nombreSede: nombre });
    if (!sedeByNombre) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro la sede con el nombre ${nombre}`
      );
    }

    return response(
      res,
      200,
      true,
      sedeByNombre,
      `Sede con el nombre ${nombre}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET VEHICULOS SEDE ESP

sedeController.getVehiculosBySede = async (req, res) => {
  try {
    const { idSede } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idSede)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idSede} no es valido para la base de datos`
      );
    }

    const sedeFound = await sedeModel.findById({ _id: idSede });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `Sede no encontrada con el id ${idSede}`
      );
    }

    const vehiculosBySede = await vehiculoModel.find({ sede: idSede });
    if (vehiculosBySede.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `La sede con el id ${idSede} no tiene vehiculos asociados`
      );
    }

    return response(
      res,
      200,
      true,
      vehiculosBySede,
      `Lista de vehiculos con el id de sede ${idSede}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET CONDUCTORES SEDE ESP

sedeController.getConductoresBySede = async (req, res) => {
  try {
    const { idSede } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idSede)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idSede} no es valido para la base de datos`
      );
    }

    const sedeFound = await sedeModel.findById({ _id: idSede });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `Sede no encontrada con el id ${idSede}`
      );
    }

    const conductoresBySede = await conductorModel.find({ sede: idSede });
    if (conductoresBySede.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `La sede con el id ${idSede} no tiene conductores asociados`
      );
    }

    return response(
      res,
      200,
      true,
      conductoresBySede,
      `Lista de conductores con el id de sede ${idSede}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET PAQUETES SEDE ESP

sedeController.getPaquetesBySede = async (req, res) => {
  try {
    const { idSede } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idSede)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idSede} no es valido para la base de datos`
      );
    }

    const sedeFound = await sedeModel.findById({ _id: idSede });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `Sede no encontrada con el id ${idSede}`
      );
    }

    const paqueteBySede = await paqueteModel.find({ sede: idSede });
    if (paqueteBySede.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `La sede con el id ${idSede} no tiene paqeutes asociados`
      );
    }

    return response(
      res,
      200,
      true,
      paqueteBySede,
      `Lista de paquetes con el id de sede ${idSede}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET USUARIOS SEDE ESP

sedeController.getUsuariosBySede = async (req, res) => {
  try {
    const { idSede } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idSede)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idSede} no es valido para la base de datos`
      );
    }

    const sedeFound = await sedeModel.findById({ _id: idSede });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `Sede no encontrada con el id ${idSede}`
      );
    }

    const usauriosBySede = await usuarioModel.find({ sede: idSede });
    if (usauriosBySede.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `La sede con el id ${idSede} no tiene usuarios asociados`
      );
    }

    return response(
      res,
      200,
      true,
      usauriosBySede,
      `Lista de usuarios con el id de sede ${idSede}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default sedeController;
