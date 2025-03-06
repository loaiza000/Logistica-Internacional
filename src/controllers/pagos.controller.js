import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { pagosModel } from "../models/pagos.model.js";
import { usuarioModel } from "../models/usuario.model.js";

const pagosController = {};

pagosController.getAllPagos = async (req, res) => {
  try {
    const pagosFound = await pagosModel
      .find()
      .populate("usuario", "nombre apellido email cc numeroCelular rol");
    if (pagosFound.length === 0) {
      return response(res, 404, false, "", "No se encontraron pagos ");
    }

    return response(res, 200, true, pagosFound, "Lista de pagos encontrada");
  } catch (error) {
    return handleError(res, error);
  }
};

pagosController.getPagosById = async (req, res) => {
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

    const pagoFound = await pagosModel
      .findById({ _id: id })
      .populate("usuario", "nombre apellido email cc numeroCelular rol");
    if (!pagoFound) {
      return response(
        res,
        404,
        false,
        "",
        `Pago no encontrado con el id ${id}`
      );
    }

    return response(
      res,
      200,
      true,
      pagoFound,
      `Pago encontrado con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

pagosController.postPatgo = async (req, res) => {
  try {
    const { monto, estado, metodoPago, nombreFactura } = req.body;

    if (!mongoose.Types.ObjectId.isValid(nombreFactura)) {
      return response(
        res,
        400,
        false,
        `El id ${nombreFactura} no es valido para la base de datos`
      );
    }

    if (!monto || !estado || !metodoPago || !nombreFactura) {
      return response(res, 400, false, "", "Todos los campos son requeridos");
    }

    if (
      estado != "pendiente".toLowerCase() ||
      estado != "pagado".toLowerCase() ||
      estado != "cancelado".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser (pendiente, cancelado y pagado)"
      );
    }

    if (
      metodoPago != "efectivo".toLowerCase() ||
      metodoPago != "tarjeta".toLowerCase() ||
      metodoPago != "transferencia".toLowerCase() ||
      metodoPago != "paypal".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El metodo de pago solo puede ser (efectivo, tarjeta, transferencia y paypal)"
      );
    }

    const usuarioFound = await usuarioModel.findById({ _id: nombreFactura });
    if (!usuarioFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro al usuario con el id ${nombreFactura}`
      );
    }

    const nuevoPago = await pagosModel.create(req.body);
    return response(res, 201, true, nuevoPago, "Pago creado con exito");
  } catch (error) {
    return handleError(res, error);
  }
};

pagosController.updatePago = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto, estado, metodoPago, nombreFactura } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const pagoFound = await pagosModel
      .findById({ _id: id })
      .populate("usuario", "nombre apellido email cc numeroCelular rol");
    if (!pagoFound) {
      return response(
        res,
        404,
        false,
        "",
        `Pago no encontrado con el id ${id}`
      );
    }

    if (!monto || !estado || !metodoPago || !nombreFactura) {
      return response(res, 400, false, "", "Todos los campos son requeridos");
    }

    if (
      estado != "pendiente".toLowerCase() ||
      estado != "pagado".toLowerCase() ||
      estado != "cancelado".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado solo puede ser (pendiente, cancelado y pagado)"
      );
    }

    if (
      metodoPago != "efectivo".toLowerCase() ||
      metodoPago != "tarjeta".toLowerCase() ||
      metodoPago != "transferencia".toLowerCase() ||
      metodoPago != "paypal".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El metodo de pago solo puede ser (efectivo, tarjeta, transferencia y paypal)"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(nombreFactura)) {
      return response(
        res,
        400,
        false,
        `El id ${nombreFactura} no es valido para la base de datos`
      );
    }
    if (pagoFound.nombreFactura != nombreFactura) {
      const usuarioFound = await usuarioModel.findById({ _id: nombreFactura });
      if (!usuarioFound) {
        return response(
          res,
          404,
          false,
          "",
          `No se encontro al usuario con el id ${nombreFactura}`
        );
      }
    }

    const pagoUpdate = await pagosModel.updateOne(req.body);
    return response(
      res,
      200,
      true,
      pagoUpdate,
      `Pago actualizado con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

pagosController.deletePago = async (req, res) => {
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

    const pagoFound = await pagosModel.findById({ _id: id });
    if (!pagoFound) {
      return response(
        res,
        404,
        false,
        "",
        `Pago no encontrado con el id ${id}`
      );
    }

    await pagosModel.updateOne({ activo: false });
    return response(res, 200, true, "", `Pago desactivado con el id ${id}`);
  } catch (error) {
    return handleError(res, error);
  }
};

// ** PAGOS CANCELADO
pagosController.getPagosCancelado = async (req, res) => {
  try {
    const cancelados = await pagosModel.find({
      estado: "cancelado".toLowerCase(),
    });
    if (cancelados.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron pagos con estado cancelado"
      );
    }
    return response(
      res,
      200,
      true,
      pagcanceladosos,
      "Lista de pagos con estado cancelado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** PAGOS PAGADO
pagosController.getPagosPagado = async (req, res) => {
  try {
    const pagados = await pagosModel.find({ estado: "pagado".toLowerCase() });
    if (pagados.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron pagos con estado pagado"
      );
    }
    return response(
      res,
      200,
      true,
      pagados,
      "Lista de pagos con estado pagado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** PAGOS PENDIENTE
pagosController.getPagosPendiente = async (req, res) => {
  try {
    const pendientes = await pagosModel.find({
      estado: "pendiente".toLowerCase(),
    });
    if (pendientes.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron pagos con estado pendiente"
      );
    }
    return response(
      res,
      200,
      true,
      pendientes,
      "Lista de pagos con estado pendiente"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** PAGO BY PAYPAL
pagosController.getPagosByPaypal = async (req, res) => {
  try {
    const paypal = await pagosModel.find({
      metodoPago: "paypal".toLowerCase(),
    });
    if (paypal.length === 0) {
      return response(res, 404, false, "", "No se encontaron pagos con paypal");
    }
    return response(res, 200, true, paypal, "Lista de pagos con paypal");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** PAGO BY TARJETA
pagosController.getPagosByTarjeta = async (req, res) => {
  try {
    const tarjeta = await pagosModel.find({
      metodoPago: "tarjeta".toLowerCase(),
    });
    if (tarjeta.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontaron pagos con tarjeta"
      );
    }
    return response(res, 200, true, tarjeta, "Lista de pagos con tarjeta");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** PAGO BY EFECTIVO
pagosController.getPagosByEfectivo = async (req, res) => {
  try {
    const efectivo = await pagosModel.find({
      metodoPago: "efectivo".toLowerCase(),
    });
    if (efectivo.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontaron pagos con efectivo"
      );
    }
    return response(res, 200, true, efectivo, "Lista de pagos con efectivo");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** PAGO BY TRANSFERENCIA
pagosController.getPagosByTransferencia = async (req, res) => {
  try {
    const transferencia = await pagosModel.find({
      metodoPago: "transferencia".toLowerCase(),
    });
    if (transferencia.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontaron pagos con transferencia"
      );
    }
    return response(
      res,
      200,
      true,
      transferencia,
      "Lista de pagos con transferencia"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** PAGOS BY USUARIO

pagosController.pagosByUser = async (req, res) => {
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

    const userFound = await usuarioModel.findById({ _id: idUser });
    if (!userFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro al usuario con el id ${idUser}`
      );
    }

    const pagosByUser = await pagosModel.find({ nombreFactura: idUser });
    if (pagosByUser.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `No hay facturas relacionadas al usuario con el id ${idUser}`
      );
    }

    return response(
      res,
      200,
      true,
      pagosByUser,
      `Lista de pagos relacionados al usuario con el id ${idUser}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default pagosController;
