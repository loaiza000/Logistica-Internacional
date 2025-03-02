import { handleError } from "../helpers/error.handler.js";
import { vehiculoModel } from "../models/vehiculo.model.js";
import mongoose from "mongoose";
import { conductorModel } from "../models/conductores.model.js";
import { sedeModel } from "../models/sede.model.js";
import { response } from "../helpers/response.js";

const vehiculoController = {};

vehiculoController.getAllVehiculos = async (req, res) => {
  try {
    const vehiculos = await vehiculoModel
      .find()
      .populate("vehiculo", "conductorAsignado sede");
    if (vehiculos.length === 0) {
      return response(
        res,
        400,
        false,
        "",
        "No se encontraron vehiculos registrados"
      );
    }

    return response(res, 200, true, vehiculos, "Vehiuclos registrados");
  } catch (error) {
    return handleError(res, error);
  }
};

vehiculoController.getVehiuloById = async (req, res) => {
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

    const vehiculoFound = await vehiculoModel
      .findById({ _id: id })
      .populate("vehiculo", "conductorAsignado sede");
    if (!vehiculoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el vehiculo con el id ${id}`
      );
    }

    return response(
      res,
      200,
      true,
      vehiculoFound,
      `Vehiculo encontrado con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

vehiculoController.postVehiuclo = async (req, res) => {
  try {
    const {
      tipo,
      placa,
      marca,
      modelo,
      anio,
      capacidadCarga,
      dimensionesCarga,
      estado,
      conductorAsignado,
      sede,
    } = req.body;

    if (
      !tipo ||
      !placa ||
      !marca ||
      !modelo ||
      !anio ||
      !capacidadCarga ||
      !dimensionesCarga ||
      !estado ||
      !conductorAsignado ||
      !sede
    ) {
      return response(res, 400, false, "", "Todos los campos son requeridos");
    }

    if (tipo != "camion".toLowerCase() || tipo != "vehiculo".toLowerCase()) {
      return response(
        res,
        400,
        false,
        sede,
        "",
        "El tipo del vehiculo solo puede ser camion o vehiculo"
      );
    }

    if (anio < 3) {
      return response(
        res,
        400,
        false,
        "",
        "El anio del vehiculo o camion no puede sert menor a 3 caracteres"
      );
    }

    if (tipo === "camion".toLowerCase() && capacidadCarga < 4000) {
      return response(
        res,
        400,
        false,
        "",
        "Ningun camion esta autorizado de cargar menos de 4.000KG en productos"
      );
    }

    if (tipo === "vehiculo".toLowerCase() && capacidadCarga < 30) {
      return response(
        res,
        400,
        false,
        "",
        "Ningun vehiculo esta autorizado de cargar menos de 30KG en productos"
      );
    }

    if (
      estado != "mantenimiento".toLowerCase() ||
      estado != "en transito".toLowerCase() ||
      estado != "disponible".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado del vehiculo o camion solo puede ser (mantenimiento, en transito o mantenimiento)"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(conductorAsignado)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${conductorAsignado} no es valido para la base de datos`
      );
    }
    const conductorFound = await conductorModel.findById({
      _id: conductorAsignado,
    });
    if (!conductorFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro al conductor con el id ${conductorAsignado}`
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
        `No se encontro la sede con el id ${sede}`
      );
    }

    const nuevoVehiculo = await vehiculoModel.create(req.body);
    return response(res, 201, true, nuevoVehiculo, "Vehiuclo creado con exito");
  } catch (error) {
    return handleError(res, error);
  }
};

vehiculoController.updateVehiuclo = async (req, res) => {
  try {
    const {
      tipo,
      placa,
      marca,
      modelo,
      anio,
      capacidadCarga,
      dimensionesCarga,
      estado,
      conductorAsignado,
      sede,
    } = req.body;
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

    const vehiculoFound = await vehiculoModel
      .findById({ _id: id })
      .populate("vehiculo", "conductorAsignado sede");
    if (!vehiculoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el vehiculo con el id ${id}`
      );
    }

    if (
      !tipo ||
      !placa ||
      !marca ||
      !modelo ||
      !anio ||
      !capacidadCarga ||
      !dimensionesCarga ||
      !estado ||
      !conductorAsignado ||
      !sede
    ) {
      return response(res, 400, false, "", "Todos los campos son requeridos");
    }

    if (vehiculoFound.tipo != tipo) {
      if (tipo != "camion".toLowerCase() || tipo != "vehiculo".toLowerCase()) {
        return response(
          res,
          400,
          false,
          sede,
          "",
          "El tipo del vehiculo solo puede ser camion o vehiculo"
        );
      }
    }

    if (anio < 3) {
      return response(
        res,
        400,
        false,
        "",
        "El anio del vehiculo o camion no puede sert menor a 3 caracteres"
      );
    }

    if (tipo === "camion".toLowerCase() && capacidadCarga < 4000) {
      return response(
        res,
        400,
        false,
        "",
        "Ningun camion esta autorizado de cargar menos de 4.000KG en productos"
      );
    }

    if (tipo === "vehiculo".toLowerCase() && capacidadCarga < 30) {
      return response(
        res,
        400,
        false,
        "",
        "Ningun vehiculo esta autorizado de cargar menos de 30KG en productos"
      );
    }

    if (vehiculoFound.estado != estado) {
      if (
        estado != "mantenimiento".toLowerCase() ||
        estado != "en transito".toLowerCase() ||
        estado != "mantenimiento".toLowerCase()
      ) {
        return response(
          res,
          400,
          false,
          "",
          "El estado del vehiculo o camion solo puede ser (mantenimiento, en transito o mantenimiento)"
        );
      }
    }

    if (!mongoose.Types.ObjectId.isValid(conductorAsignado)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${conductorAsignado} no es valido para la base de datos`
      );
    }
    if (vehiculoFound.conductorAsignado != conductorAsignado) {
      const conductorFound = await conductorModel.findById({
        _id: conductorAsignado,
      });
      if (!conductorFound) {
        return response(
          res,
          404,
          false,
          "",
          `No se encontro al conductor con el id ${conductorAsignado}`
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
    if (vehiculoFound.sede != sede) {
      const sedeFound = await sedeModel.findById({ _id: sede });
      if (!sedeFound) {
        return response(
          res,
          404,
          false,
          "",
          `No se encontro la sede con el id ${sede}`
        );
      }
    }

    const vehiculoUpdate = await vehiculoFound.updateOne(req.body);
    return response(
      res,
      200,
      true,
      vehiculoUpdate,
      `Vehiculo actualizado con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

vehiculoController.deleteVehiculo = async (req, res) => {
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

    const vehiculoFound = await vehiculoModel.findById({ _id: id });
    if (!vehiculoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el vehiculo con el id ${id}`
      );
    }

    await vehiculoFound.updateOne({ activo: false });
    return response(res, 200, true, "", "Vehiculo desacticado");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET VEHICULOS ACTIVOS

vehiculoController.getVehiculosActivos = async (req, res) => {
  try {
    const vehiculosActivos = await vehiculoModel.find({ activo: true });
    if (vehiculosActivos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron vehciulos activos"
      );
    }

    return response(res, 200, true, vehiculosActivos, "Vehiculos activos");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET VEHICULOS INACTIVOS

vehiculoController.getVehiculosInactivos = async (req, res) => {
  try {
    const vehiculosInactivos = await vehiculoModel.find({ activo: true });
    if (vehiculosInactivos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron vehciulos inactivos"
      );
    }

    return response(res, 200, true, vehiculosInactivos, "Vehiculos inactivos");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET CAMIONES

vehiculoController.getVehiculosCamiones = async (req, res) => {
  try {
    const vehiculosCamiones = await vehiculoModel.find({
      tipo: "camion".toLowerCase(),
    });
    if (vehiculosCamiones.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron vehciulos tipo camion"
      );
    }

    return response(
      res,
      200,
      true,
      vehiculosCamiones,
      "Vehiculos de tipo camion"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET VEHICULOS TIPO AUTOMOVIL

vehiculoController.getVehiculosAutomovil = async (req, res) => {
  try {
    const vehiculosAutomovil = await vehiculoModel.find({
      tipo: "automovil".toLowerCase(),
    });
    if (vehiculosAutomovil.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron vehciulos tipo automovil"
      );
    }

    return response(
      res,
      200,
      true,
      vehiculosAutomovil,
      "Vehiculos de tipo automovil"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET VEHICULOS BY ESTADO DISPONIBLE

vehiculoController.getVehiculosDisponibles = async (req, res) => {
  try {
    const vehiculosDisponibles = await vehiculoModel.find({
      estado: "disponible".toLowerCase(),
    });
    if (vehiculosDisponibles.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron vehciulos disponibles"
      );
    }

    return response(
      res,
      200,
      true,
      vehiculosDisponibles,
      "Vehiculos disponibles"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET VEHCIULOS BY ESTADO EN TRANSITO

vehiculoController.getVehiculosEnTransito = async (req, res) => {
  try {
    const vehiculosEnTransito = await vehiculoModel.find({
      estado: "en transito".toLowerCase(),
    });
    if (vehiculosEnTransito.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron vehciulos en transito"
      );
    }

    return response(
      res,
      200,
      true,
      vehiculosEnTransito,
      "Vehiculos en transito"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET VEHICULOS BY ESTADO MANTENIMIENTO

vehiculoController.getVehiculosMantenimiento = async (req, res) => {
  try {
    const vehiculosMantenimiento = await vehiculoModel.find({
      estado: "mantenimiento".toLowerCase(),
    });
    if (vehiculosMantenimiento.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron vehciulos en mantenimiento"
      );
    }

    return response(
      res,
      200,
      true,
      vehiculosMantenimiento,
      "Vehiculos en mantenimiento"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET VEHICULOS BY PLACA

vehiculoController.getVehiculosByPlaca = async (req, res) => {
  try {
    const { placa } = req.params;

    const vehiculosByPlaca = await vehiculoModel.findOne({ placa: placa });
    if (!vehiculosByPlaca) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el vehiculo con la placa ${placa}`
      );
    }

    return response(
      res,
      200,
      true,
      vehiculosByPlaca,
      `Vehiculo con la placa ${placa}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET VEHICULO BY SEDE

vehiculoController.getVehiculoBySede = async (req, res) => {
  try {
    const { idSede } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idSede)) {
      `El id ${id} no es valido para la base de datos`;
    }

    const sedeFound = await sedeModel.findById({ _id: idSede });
    if (!sedeFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro la sede con el id ${idSede}`
      );
    }

    const vehciulosBySede = await vehiculoModel.find({ sede: idSede });
    if (vehciulosBySede.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontaron vehiculos en la sede con el id ${idSede}`
      );
    }

    return response(
      res,
      200,
      true,
      vehciulosBySede,
      `Vehiculos registrados en la sede con el id ${idSede}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default vehiculoController;
