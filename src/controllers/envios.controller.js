import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { envioModel } from "../models/envio.model.js";
import { vehiculoModel } from "../models/vehiculo.model.js";
import { conductorModel } from "../models/conductores.model.js";
import { generateToken } from "../helpers/generate.token.js";

const enviosController = {};

enviosController.getAllEnvios = async (req, res) => {
  try {
    const envios = await envioModel
      .find()
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );
    if (envios.length === 0) {
      return response(res, 404, false, "", "No se encontraron envios");
    }

    return response(res, 200, true, envios, "Lista de envios");
  } catch (error) {
    return handleError(res, error);
  }
};

enviosController.getEnviosById = async (req, res) => {
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

    const envioFound = await envioModel
      .findById({ _id: id })
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );
    if (!envioFound) {
      return response(
        res,
        404,
        false,
        "",
        `Envio no encontrado con el id ${id}`
      );
    }

    return response(res, 200, true, envioFound, `Envio encontrado`);
  } catch (error) {
    return handleError(res, error);
  }
};

enviosController.postEnvio = async (req, res) => {
  try {
    const {
      origen,
      destino,
      peso,
      volumen,
      numeroEnvio,
      vehiculo,
      tipoMercancia,
      conductor,
      estado,
      tipoEnvio,
    } = req.body;

    if (!origen || !destino) {
      return response(
        res,
        400,
        false,
        "",
        "El origen y el destino no pueden ir vacios"
      );
    }

    if (
      !tipoEnvio ||
      tipoEnvio != "nacional".toLowerCase() ||
      tipoEnvio != "internacional".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El tipo de envio solo puede ser (nacional o internacional)"
      );
    }

    if (origen === destino) {
      return response(
        res,
        400,
        false,
        "",
        "El origen y el destino no pueden ser iguales"
      );
    }

    if (
      !tipoMercancia ||
      tipoMercancia != "documentos".toLowerCase() ||
      tipoMercancia != "paquetes".toLowerCase() ||
      tipoMercancia != "delicado".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El tipo de mercancia solo puede ser (Docuemntos, Paquetes o Delicado)"
      );
    }

    if (!peso || peso <= 0) {
      return response(
        res,
        400,
        false,
        "",
        "El peso del paquete no puede ser menor o igual a 0"
      );
    }

    if (!volumen || volumen <= 0) {
      return response(
        res,
        400,
        false,
        "",
        "El volumen del paquete no puede ser menor o igual a 0"
      );
    }

    if (!numeroEnvio) {
      return response(
        res,
        400,
        false,
        "",
        "El numero de envio no puede ir vacio"
      );
    }

    if (
      !estado ||
      estado != "Pendiente".toLowerCase() ||
      estado != "En camino".toLowerCase() ||
      estado != "Cancelado".toLowerCase() ||
      estado != "Entregado".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser [Pendiente, En camino, Cancelado o Entregado]"
      );
    }

    const numeroEnvioFound = await envioModel.findOne({
      numeroEnvio: numeroEnvio,
    });
    if (numeroEnvioFound) {
      return response(
        res,
        400,
        false,
        "",
        `El numero de envio ${numeroEnvio} ya esta registrado`
      );
    }

    const vehiculoFound = await vehiculoModel.findById({ _id: vehiculo });
    if (!vehiculoFound) {
      return response(
        res,
        404,
        false,
        "",
        `Vehiculo no encontrado con el id ${vehiculo}`
      );
    }

    const conductorFound = await conductorModel.findById({ _id: conductor });
    if (!conductorFound) {
      return response(
        res,
        404,
        false,
        "",
        `conductor no encontrado con el id ${conductor}`
      );
    }

    let tipoMercanciaDiv;
    switch (tipoMercancia.toLowerCase()) {
      case "documentos":
        tipoMercanciaDiv = 1;
        break;
      case "paquetes":
        tipoMercanciaDiv = 2;
        break;
      case "delicado":
        tipoMercanciaDiv = 3;
        break;
    }

    const costoEnvio = peso * volumen + tipoMercanciaDiv;

    const newEnvio = await envioModel.create(req.body);
    const token = generateToken({ envio: newEnvio._id });
    newEnvio.token = token;
    newEnvio.costo = costoEnvio;
    await newEnvio.save();
    return response(res, 201, true, newEnvio, "Envío creado con éxito");
  } catch (error) {
    return handleError(res, error);
  }
};

enviosController.updateEnvio = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      origen,
      destino,
      peso,
      volumen,
      numeroEnvio,
      vehiculo,
      conductor,
      tipoMercancia,
      tipoEnvio,
      estado,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const envioFound = await envioModel.findById({ _id: id });
    if (!envioFound) {
      return response(
        res,
        404,
        false,
        "",
        `Envio no encontrado con el id ${id}`
      );
    }

    if (
      !tipoEnvio ||
      tipoEnvio != "nacional".toLowerCase() ||
      tipoEnvio != "internacional".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El tipo de envio solo puede ser (nacional o internacional)"
      );
    }

    if (
      !tipoMercancia ||
      tipoMercancia != "documentos".toLowerCase() ||
      tipoMercancia != "paquetes".toLowerCase() ||
      tipoMercancia != "delicado".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El tipo de mercancia solo puede ser (Docuemntos, Paquetes o Delicado)"
      );
    }

    if (!origen || !destino) {
      return response(
        res,
        400,
        false,
        "",
        "El origen y el destino no pueden ir vacios"
      );
    }

    if (origen === destino) {
      return response(
        res,
        400,
        false,
        "",
        "El origen y el destino no pueden ser iguales"
      );
    }

    if (!peso || peso <= 0) {
      return response(
        res,
        400,
        false,
        "",
        "El peso del paquete no puede ser menor o igual a 0"
      );
    }

    if (!volumen || volumen <= 0) {
      return response(
        res,
        400,
        false,
        "",
        "El volumen del paquete no puede ser menor o igual a 0"
      );
    }

    if (envioFound.estado != estado) {
      if (
        !estado ||
        estado != "pendiente".toLowerCase() ||
        estado != "en camino".toLowerCase() ||
        estado != "cancelado".toLowerCase() ||
        estado != "entregado".toLowerCase()
      ) {
        return response(
          res,
          400,
          false,
          "",
          "El estado solo puede ser [Pendiente, En camino, Cancelado o Entregado]"
        );
      }
    }

    if (!numeroEnvio || envioFound.numeroEnvio != numeroEnvio) {
      const numeroEnvioFound = await envioModel.findOne({
        numeroEnvio: numeroEnvio,
      });
      if (numeroEnvioFound) {
        return response(
          res,
          400,
          false,
          "",
          `El numero de envio ${numeroEnvio} ya esta registrado`
        );
      }
    }

    if (!vehiculo || envioFound.vehiculo != vehiculo) {
      const vehiculoFound = await vehiculoModel.findById({ _id: vehiculo });
      if (!vehiculoFound) {
        return response(
          res,
          404,
          false,
          "",
          `Vehiculo no encontrado con el id ${vehiculo}`
        );
      }
    }

    if (!conductor || envioFound.conductor != conductor) {
      const conductorFound = await conductorModel.findById({ _id: conductor });
      if (!conductorFound) {
        return response(
          res,
          404,
          false,
          "",
          `conductor no encontrado con el id ${conductor}`
        );
      }
    }

    const envioUpdate = await envioFound.updateOne(req.body);
    return response(res, 200, true, envioUpdate, "Envio actualizado");
  } catch (error) {
    return handleError(res, error);
  }
};

enviosController.deleteEnvio = async (req, res) => {
  try {
    const { id } = req.prams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const envioFound = await envioModel.findById({ _id: id });
    if (!envioFound) {
      return response(
        res,
        404,
        false,
        "",
        `Envio no encontrado con el id ${id}`
      );
    }

    await envioFound.updateOne({ activo: false });
    return response(res, 200, true, "", "Envio desactivado con exito");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS WITH ESTADO PENDIENTE

enviosController.getEnviosPendientes = async (req, res) => {
  try {
    const enviosPendientes = await envioModel
      .find({
        estado: "pendiente".toLowerCase(),
      })
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );
    if (enviosPendientes.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No hay envios pendientes por el momento"
      );
    }

    return response(
      res,
      200,
      true,
      enviosPendientes,
      "Lista de envios pendientes"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS WITH ESTADO CANCELADO

enviosController.getEnviosCancelados = async (req, res) => {
  try {
    const enviosCancelados = await envioModel
      .find({
        estado: "cancelado".toLowerCase(),
      })
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );
    if (enviosCancelados.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No hay envios cancelados por el momento"
      );
    }

    return response(
      res,
      200,
      true,
      enviosCancelados,
      "Lista de envios cancelados"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS WITH ESTADO ENTREGADOS

enviosController.getEnviosEntregados = async (req, res) => {
  try {
    const enviosEntregados = await envioModel
      .find({
        estado: "entregado".toLowerCase(),
      })
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );
    if (enviosEntregados.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No hay envios entregados por el momento"
      );
    }

    return response(
      res,
      200,
      true,
      enviosEntregados,
      "Lista de envios entregados"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS WITH ESTADO EN CAMINO

enviosController.getEnviosEnCamino = async (req, res) => {
  try {
    const enviosEnCamino = await envioModel
      .find({
        estado: "en camino".toLowerCase(),
      })
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );
    if (enviosEnCamino.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No hay envios en camino por el momento"
      );
    }

    return response(
      res,
      200,
      true,
      enviosEnCamino,
      "Lista de envios en camino"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS BY CONDUCTOR

enviosController.getEnviosByConductor = async (req, res) => {
  try {
    const { idConductor } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idConductor)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idConductor} no es valido para la base de datos`
      );
    }

    const enviosPorConductor = await envioModel
      .find({
        condcutor: idConductor,
      })
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );
    if (enviosPorConductor.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "El conductor no tiene envios asociados"
      );
    }

    return response(
      res,
      200,
      true,
      enviosPorConductor,
      `Envios asociados al conductor con el id ${idConductor}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS BY VEHICULO

enviosController.getEnviosByVehiculos = async (req, res) => {
  try {
    const { idVehiculo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idConductor)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idVehiculo} no es valido para la base de datos`
      );
    }

    const enviosPorVehiculo = await envioModel
      .find({
        vehiculo: idVehiculo,
      })
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );
    if (enviosPorVehiculo.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "El vehiculo no tiene envios asociados"
      );
    }

    return response(
      res,
      200,
      true,
      enviosPorConductor,
      `Envios asociados al vehiculo con el id ${idVehiculo}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** SIMULATE COSTO

enviosController.simulateCosto = async (req, res) => {
  try {
    const { peso, volumen, tipoMercancia } = req.body;

    let tipoMercanciaDiv;
    switch (tipoMercancia.toLowerCase()) {
      case "documentos":
        tipoMercanciaDiv = 1;
        break;
      case "paquetes":
        tipoMercanciaDiv = 2;
        break;
      case "delicado":
        tipoMercanciaDiv = 3;
        break;
    }

    const costoEnvio = peso * volumen + tipoMercanciaDiv;
    return response(res, 200, true, costoEnvio, "Simulacion de costo de envio");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS NACIONALES

enviosController.getEnviosNacionales = async (req, res) => {
  try {
    const enviosNacionales = await envioModel
      .find({ tipoEnvio: "nacional".toLowerCase() })
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );

    if (enviosNacionales.length === 0) {
      return response(res, 404, false, "", "No hay envios nacionales ");
    }

    return response(
      res,
      200,
      true,
      enviosNacionales,
      "Lista de envios nacionales"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS INTERNACIONALES

enviosController.getEnviosInternacionales = async (req, res) => {
  try {
    const enviosInternacionales = await envioModel
      .find({ tipoEnvio: "internacional".toLowerCase() })
      .populate(
        "vehiculo",
        "tipo placa marca modelo anio capacidadCarga dimensionesCarga estado"
      )
      .populate(
        "conductor",
        "nombre apellido numeroCelular cc estado direccion activo"
      );

    if (enviosInternacionales.length === 0) {
      return response(res, 404, false, "", "No hay envios internacionales");
    }

    return response(
      res,
      200,
      true,
      enviosInternacionales,
      "Lista de envios internacionales"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS BY VEHICULO

enviosController.getEnviosByVehiculo = async (req, res) => {
  try {
    const { idVehiculo } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idVehiculo)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const vehiculoFound = await vehiculoModel.findById({ _id: idVehiculo });
    if (!vehiculoFound) {
      return response(
        res,
        404,
        false,
        "",
        `Vehiculo no encontrado con el id ${idVehiculo}`
      );
    }

    const enviosByVehiculo = await envioModel.find({ _id: idVehiculo });
    if (enviosByVehiculo.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontraron envios con el id de vehicualo ${idVehiculo}`
      );
    }

    return response(
      res,
      200,
      true,
      enviosByVehiculo,
      `Lista de envios aosicaods al vehiculo con el id ${idVehiculo}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET ENVIOS BY CONDUCTOR

enviosController.getEnviosByVehiculo = async (req, res) => {
  try {
    const { idConductor } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idVehiculo)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const conductorFound = await conductorModel.findById({ _id: idConductor });
    if (!conductorFound) {
      return response(
        res,
        404,
        false,
        "",
        `Conductores no encontrado con el id ${idConductor}`
      );
    }

    const enviosByConductor = await envioModel.find({ _id: idVehiculo });
    if (enviosByConductor.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontraron envios con el id de conductor ${idConductor}`
      );
    }

    return response(
      res,
      200,
      true,
      enviosByVehiculo,
      `Lista de envios asociados al conductor con el id ${idConductor}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default enviosController;
