import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { paqueteModel } from "../models/paquete.model.js";
import { envioModel } from "../models/envio.model.js";
import { sedeModel } from "../models/sede.model.js";

const paqueteController = {};

paqueteController.getPaquetes = async (req, res) => {
  try {
    const paquetes = await paqueteModel
      .find()
      .populate("sede", "nombreSede ubiacion");
    if (paquetes.length === 0) {
      return response(res, 404, false, "", "Lista de paquetes vacia");
    }

    return response(res, 200, true, paquetes, "Lista de paquetes");
  } catch (error) {
    return handleError(res, error);
  }
};

paqueteController.getPaquetesById = async (req, res) => {
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

    const paqueteFound = await paqueteModel
      .findById({ _id: id })
      .populate("sede", "nombreSede ubiacion");
    if (!paqueteFound) {
      return response(
        res,
        404,
        false,
        "",
        `Paquete no encontrado con el id ${id}`
      );
    }

    return response(
      res,
      200,
      true,
      paqueteFound,
      `Paquete encontrado con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

paqueteController.postPaquete = async (req, res) => {
  try {
    const { peso, dimensiones, estado, sede, sku, envioAsignado } = req.body;

    if (!peso || peso < 1) {
      return response(
        res,
        400,
        false,
        "",
        "El peso no peso no puede ser menor a 1"
      );
    }

    if (
      !descripcion ||
      !peso ||
      !dimensiones ||
      !direccionDestino ||
      !destinatario ||
      !sede
    ) {
      return response(
        res,
        400,
        false,
        "",
        "Todos los campos obligatorios deben estar llenos"
      );
    }

    if (!dimensiones.largo || !dimensiones.ancho || !dimensiones.alto) {
      return response(
        res,
        400,
        false,
        "",
        "Las dimensiones deben incluir largo, ancho y alto"
      );
    }

    if (
      !estado ||
      estado != "pendiente".toLowerCase() ||
      estado != "en transito".toLowerCase() ||
      estado != "entregado".toLowerCase() ||
      estado != "devuelto".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser (pendiente, en transito, entregado o devuelto)"
      );
    }

    const skuFound = await paqueteModel.findOne({ sku: sku });
    if (skuFound) {
      return response(
        res,
        400,
        false,
        "",
        `El sku ${sku} ya se encuentra registrado`
      );
    }

    if (!mongoose.Types.ObjectId.isValid(envioAsignado)) {
      return response(
        res,
        400,
        false,
        "",
        `El envio con el id ${envioAsignado} no es valido para la base de datos`
      );
    }

    const envioFound = await envioModel.findById({ _id: envioAsignado });
    if (!envioFound) {
      return response(
        res,
        404,
        false,
        "",
        `Envio con el id ${envioAsignado} no encontrado`
      );
    }

    const nuevoPaquete = new paqueteModel({
      descripcion,
      peso,
      dimensiones,
      estado,
      envioAsignado,
      sede,
      sku,
    });

    await nuevoPaquete.save();
    return response(res, 201, true, nuevoPaquete, "Paquete creado con éxito");
  } catch (error) {
    return handleError(res, error);
  }
};

paqueteController.updatePaquete = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      peso,
      dimensiones,
      estado,
      sede,
      sku,
      envioAsignado,
      descripcion,
      direccionDestino,
      destinatario,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es válido para la base de datos`
      );
    }

    const paqueteFound = await paqueteModel.findById(id);
    if (!paqueteFound) {
      return response(
        res,
        404,
        false,
        "",
        `Paquete con el id ${id} no encontrado`
      );
    }

    if (!sku || paqueteFound.sku !== sku) {
      const skuFound = await paqueteModel.findOne({ sku });
      if (skuFound) {
        return response(
          res,
          400,
          false,
          "",
          `El sku ${sku} ya se encuentra registrado`
        );
      }
    }

    if (!envioAsignado || paqueteFound.envioAsignado !== envioAsignado) {
      if (!mongoose.Types.ObjectId.isValid(envioAsignado)) {
        return response(res, 400, false, "", `El id del envío no es válido`);
      }
      const envioFound = await envioModel.findById(envioAsignado);
      if (!envioFound) {
        return response(
          res,
          404,
          false,
          "",
          `Envío con el id ${envioAsignado} no encontrado`
        );
      }
    }

    if (!sede || paqueteFound.sede != sede) {
      if (!mongoose.Types.ObjectId.isValid(sede)) {
        return response(
          res,
          404,
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
          `Sede no encontrada con el id ${sede}`
        );
      }
    }

    if (!peso || peso < 1) {
      return response(res, 400, false, "", "El peso no puede ser menor a 1");
    }

    if (
      !descripcion ||
      !peso ||
      !dimensiones ||
      !direccionDestino ||
      !destinatario ||
      !sede
    ) {
      return response(
        res,
        400,
        false,
        "",
        "Todos los campos obligatorios deben estar llenos"
      );
    }

    if (!dimensiones.largo || !dimensiones.ancho || !dimensiones.alto) {
      return response(
        res,
        400,
        false,
        "",
        "Las dimensiones deben incluir largo, ancho y alto"
      );
    }

    if (
      !estado ||
      estado != "pendiente".toLowerCase() ||
      estado != "en transito".toLowerCase() ||
      estado != "entregado".toLowerCase() ||
      estado != "devuelto".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser (pendiente, en transito, entregado o devuelto)"
      );
    }

    const paqueteUpdate = await paqueteModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return response(
      res,
      200,
      true,
      paqueteUpdate,
      `Paquete con el id ${id} actualizado con éxito`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

paqueteController.deletePaquete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es válido para la base de datos`
      );
    }

    const paqueteFound = await paqueteModel.findById(id);
    if (!paqueteFound) {
      return response(
        res,
        404,
        false,
        "",
        `Paquete con el id ${id} no encontrado`
      );
    }

    await paqueteFound.updateOne({ activo: false });
    return response(res, 200, true, "", `Paquete desactivado con el id ${id}`);
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET PAQUETES ACTIVOS

paqueteController.getPaquetesActivos = async (req, res) => {
  try {
    const paquetesActivos = await paqueteModel.find({ activo: true });
    if (paquetesActivos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron paquetes activos"
      );
    }

    return response(
      res,
      404,
      false,
      paquetesActivos,
      "Lista de paquetes activos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET PAQUETES INACTIVOS

paqueteController.getPaquetesInactivos = async (req, res) => {
  try {
    const paquetesInactivos = await paqueteModel.find({ activo: true });
    if (paquetesInactivos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron paquetes inactivos"
      );
    }

    return response(
      res,
      200,
      true,
      paquetesInactivos,
      "Lista de paquetes inactivos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET PAQUETES PENDIENTES

paqueteController.paquetesPendientes = async (req, res) => {
  try {
    const paquetesPendientes = await paqueteModel.find({
      estado: "pendiente".toLowerCase(),
    });
    if (paquetesPendientes.lenght === 0) {
      return response(
        res,
        404,
        false,
        "",
        "Paquetes no encontradas con el estado pendiente"
      );
    }

    return response(
      res,
      200,
      true,
      paquetesPendientes,
      "Lista de paqeuetes con el estado en pendiente"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET PAQUETES ENTREGADOS

paqueteController.paquetesEntregados = async (req, res) => {
  try {
    const paquetes = await paqueteModel
      .find({ estado: "entregado" })
      .populate("sede", "nombreSede ubiacion");
    if (paquetes.length === 0) {
      return response(res, 404, false, "", "No hay paquetes entregados");
    }

    return response(res, 200, true, paquetes, "Lista de paquetes entregados");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET PAQUETES DEVUELTOS

paqueteController.paquetesDevueltos = async (req, res) => {
  try {
    const paquetesDevueltos = await paqueteModel.find({
      estado: "devuelto".toLowerCase(),
    });
    if (paquetesDevueltos.lenght === 0) {
      return response(
        res,
        404,
        false,
        "",
        "Paquetes no encontradas con el estado devueltos"
      );
    }

    return response(
      res,
      200,
      true,
      paquetesDevueltos,
      "Lista de paqeuetes con el estado en devueltos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET PAQUETES EN TRANSITO

paqueteController.paquetesTransito = async (req, res) => {
  try {
    const paquetesTransito = await paqueteModel.find({
      estado: "transito".toLowerCase(),
    });
    if (paquetesTransito.lenght === 0) {
      return response(
        res,
        404,
        false,
        "",
        "Paquetes no encontradas con el estado transito"
      );
    }

    return response(
      res,
      200,
      true,
      paquetesTransito,
      "Lista de paqeuetes con el estado en transito"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET PAQUETES BY SEDE

paqueteController.getPaqueteBySede = async (req, res) => {
  try {
    const { idEnvio } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idEnvio)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idEnvio} no es valido para la base de datos`
      );
    }

    const paquetesBySede = await paqueteModel.find({ sede: idEnvio });
    if (paquetesBySede.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `se encontraron paquetes con el envio asignado ${idEnvio}`
      );
    }

    return response(
      res,
      404,
      false,
      "",
      `se encontraron paquetes con el envioAsignado ${idEnvio}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** GET PAQUETES BY ENVIO ASIGNADO

paqueteController.getPaqutesByEnvio = async (req, res) => {
  try {
    const { idEnvio } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idEnvio)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idEnvio} no es valido para la base de datos`
      );
    }

    const envioFound = await envioModel.findById({ _id: idEnvio });
    if (!envioFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el envio con el id ${idEnvio}`
      );
    }

    const paquetesEnvio = await paqueteModel.find({ envioAsignado: idEnvio });
    if (paquetesEnvio.lenght === 0) {
      return response(
        res,
        404,
        false,
        "",
        `El envio con el id ${idEnvio} no tiene paquetes asignados`
      );
    }

    return response(
      res,
      200,
      true,
      paquetesEnvio,
      `Paquetes asignados al envio con el id ${idEnvio}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default paqueteController;
