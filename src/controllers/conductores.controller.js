import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { conductorModel } from "../models/conductores.model.js";
import { generateToken } from "../helpers/generate.token.js";
import { vehiculoModel } from "../models/vehiculo.model.js";
import { sedeModel } from "../models/sede.model.js";

const conductoresController = {};

conductoresController.getAllConductores = async (req, res) => {
  try {
    const conductores = await conductorModel
      .find()
      .populate(
        "envio",
        "origen destino peso volumen tipoMercancia numeroEnvio estado costo activo"
      )
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate("sede", "nombreSede ubiacion");

    if (conductores.length === 0) {
      return response(res, 404, false, "", "No hay conductores registrados");
    }

    return response(res, 200, true, conductores, "Conductores registrados");
  } catch (error) {
    return handleError(res, error);
  }
};

conductoresController.getConductorById = async (req, res) => {
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

    const conductorFound = await conductorModel
      .findById({ _id: id })
      .populate(
        "envio",
        "origen destino peso volumen tipoMercancia numeroEnvio estado costo activo"
      )
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate("sede", "nombreSede ubiacion");
    if (!conductorFound) {
      return response(
        res,
        404,
        false,
        "",
        `Conductor con el id${id} no encontrado`
      );
    }

    return response(res, 200, true, conductorFound, "Conductor encontrado");
  } catch (error) {
    return handleError(res, error);
  }
};

conductoresController.postConductor = async (req, res) => {
  try {
    const { numeroCelular, cc, estado, vehiculo, sede } = req.body;

    const numeroCelularFoud = await conductorModel.findOne({
      numeroCelular: numeroCelular,
    });
    if (numeroCelularFoud) {
      return response(
        res,
        404,
        false,
        "",
        `El numero de celular ${numeroCelular} ya se encuentra en uso`
      );
    }

    const ccFound = await conductorModel.findOne({ cc: cc });
    if (ccFound) {
      return response(
        res,
        404,
        false,
        "",
        `La C.C ${cc} ya se encuentra en uso`
      );
    }

    if (
      !estado ||
      estado != "activo".toLowerCase() ||
      estado != "inactivo".toLowerCase() ||
      estado != "suspendido".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser (activo, inactivo o suspendido)"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(vehiculo)) {
      return response(
        res,
        400,
        false,
        "",
        `El id del vehiculo ${vehiculo} no es valido para la base de datos`
      );
    }
    const vehiculoFound = await vehiculoModel.findById({ _id: vehiculo });
    if (!vehiculoFound) {
      return response(
        res,
        404,
        false,
        "",
        `El vehciulo con el id ${vehiculo} no se encuentra`
      );
    }

    if (!mongoose.Types.ObjectId.isValid(sede)) {
      return response(
        res,
        400,
        false,
        "",
        `El id de la sede ${sede} no es valido para la base de datos`
      );
    }
    const sedeFound = await sedeModel.findById({ _id: sede });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `La sede con el id ${sede} no se encuentra`
      );
    }

    const nuevoConductor = await conductorModel.create(req.body);
    const token = generateToken({ conductor: nuevoConductor._id });
    nuevoConductor.token = token;
    await nuevoConductor.save();
    return response(
      res,
      201,
      true,
      nuevoConductor,
      "Conductor creado con exito"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

conductoresController.updateConductor = async (req, res) => {
  try {
    const { numeroCelular, cc, estado, vehiculo, sede } = req.body;
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

    const conductorFound = await conductorModel.findById({ _id: id });
    if (!conductorFound) {
      return response(
        res,
        404,
        false,
        "",
        `Conductor con el id${id} no encontrado`
      );
    }

    if (!numeroCelular || conductorFound.numeroCelular != numeroCelular) {
      const numeroCelularFoud = await conductorModel.findOne({
        numeroCelular: numeroCelular,
      });
      if (numeroCelularFoud) {
        return response(
          res,
          404,
          false,
          "",
          `El numero de celular ${numeroCelular} ya se encuentra en uso`
        );
      }
    }

    if (!cc || conductorFound.cc != cc) {
      const ccFound = await conductorModel.findOne({ cc: cc });
      if (ccFound) {
        return response(
          res,
          404,
          false,
          "",
          `La C.C ${cc} ya se encuentra en uso`
        );
      }
    }

    if (
      !estado ||
      estado != "activo".toLowerCase() ||
      estado != "inactivo".toLowerCase() ||
      estado != "suspendido".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser (activo, inactivo o suspendido)"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(vehiculo)) {
      return response(
        res,
        400,
        false,
        "",
        `El id del vehiculo ${vehiculo} no es valido para la base de datos`
      );
    }
    if (!vehiculo || conductorFound.vehiculo != vehiculo) {
      const vehiculoFound = await vehiculoModel.findById({ _id: vehiculo });
      if (!vehiculoFound) {
        return response(
          res,
          404,
          false,
          "",
          `El vehciulo con el id ${vehiculo} no se encuentra`
        );
      }
    }

    if (!mongoose.Types.ObjectId.isValid(sede)) {
      return response(
        res,
        400,
        false,
        "",
        `El id de la sede ${sede} no es valido para la base de datos`
      );
    }
    if (!sede || conductorFound.sede != sede) {
      const sedeFound = await sedeModel.findById({ _id: sede });
      if (!sedeFound) {
        return response(
          res,
          404,
          false,
          "",
          `La sede con el id ${sede} no se encuentra`
        );
      }
    }

    const conductorActualizado = await conductorModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    return response(
      res,
      200,
      true,
      conductorActualizado,
      "Conductor actualizado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

conductoresController.deleteConductor = async (req, res) => {
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

    const conductorFound = await conductorModel.findById({ _id: id });
    if (!conductorFound) {
      return response(
        res,
        404,
        false,
        "",
        `Conductor no encontrado con el id ${id}`
      );
    }

    await conductorModel.updateOne({ _id: id }, { activo: false });
    return response(res, 200, true, "", `Conductor con el id ${id} eliminado`);
  } catch (error) {
    return handleError(res, error);
  }
};

// ** CONDUCTORES WHERE ACTIVO = TRUE

conductoresController.getConductoresByActivo = async (req, res) => {
  try {
    const conductoresActivos = await conductorModel.find({ activo: true });
    if (conductoresActivos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron conductores activos"
      );
    }

    return response(
      res,
      200,
      true,
      conductoresActivos,
      "Lista de conductores activos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET CONDUCTORES INACTIVOS

conductoresController.getConductoresInactivos = async (req, res) => {
  try {
    const getConductoresInactivos = await conductorModel.find({
      activo: false,
    });
    if (!getConductoresInactivos) {
      return response(
        res,
        false,
        404,
        "",
        "No se encontraron conductores inactivos"
      );
    }

    return response(
      res,
      200,
      true,
      getConductoresInactivos,
      "Lista de conductores inactivos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET CONDUCTORES BY SEDE

conductoresController.getConductoresBySde = async (req, res) => {
  try {
    const { idSede } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idSede)) {
      return response(
        res,
        404,
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
      `Conductores asociados a la sede con el id ${idSede}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET CONDUCTORES SUSPENDIDOS

conductoresController.getConductoresSuspendidos = async (req, res) => {
  try {
    const conductoresSuspendidos = await conductorModel.find({
      estado: "suspendido".toLowerCase,
    });
    if (conductoresSuspendidos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron conductores suspendidos"
      );
    }

    return response(
      res,
      200,
      true,
      conductoresSuspendidos,
      "Lista de conductores suspendidos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET CONDUCTORES OCUPADOS

conductoresController.getConductoresOcupados = async (req, res) => {
  try {
    const conductoresOcupados = await conductorModel.find({
      estado: "ocupado".toLowerCase,
    });
    if (conductoresOcupados.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron conductores ocupados"
      );
    }

    return response(
      res,
      200,
      true,
      conductoresOcupados,
      "Lista de conductores ocupados"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET CONDUCTORES DISPONIBLES

conductoresController.getConductoresDisponibles = async (req, res) => {
  try {
    const conductoresDisponibles = await conductorModel.find({
      estado: "disponible".toLowerCase,
    });
    if (conductoresDisponibles.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron conductores disponibles"
      );
    }

    return response(
      res,
      200,
      true,
      conductoresDisponibles,
      "Lista de conductores disponibles"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET CONDUCTORES BY SEDE

conductoresController.getConductoresBySede = async (req, res) => {
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
        `No se encontraron conductores en la sede con el id ${idSede}`
      );
    }

    return response(
      res,
      200,
      true,
      conductoresBySede,
      `Lista de conductores en la sede con el id ${idSede}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default conductoresController;
