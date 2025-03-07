import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { inventarioModel } from "../models/inventario.model.js";
import { sedeModel } from "../models/sede.model.js";
import { response } from "../helpers/response.js";

const inventarioController = {};

inventarioController.getAllInventario = async (req, res) => {
  try {
    const inventarios = await inventarioModel
      .find()
      .populate("sede", "nombreSede, ubiacion");
    if (inventarios.length === 0) {
      return response(res, 404, false, "", "No se encontro inventario");
    }

    return response(res, 200, true, "", "No se encontro inventario");
  } catch (error) {
    return handleError(res, error);
  }
};

inventarioController.getInventarioById = async (req, res) => {
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
    const inventarioFound = await inventarioModel
      .findById({ _id: id })
      .populate("sede", "nombreSede, ubiacion");
    if (!inventarioFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro inventario con el id ${id}`
      );
    }

    return response(
      res,
      200,
      true,
      inventarioFound,
      `Inventario con el id ${idSede}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

inventarioController.postInventario = async (req, res) => {
  try {
    const { nombre, cantidad, unidadMedida, categoria, sede } = req.body;

    if (!nombre || !cantidad || !unidadMedida || !categoria || !sede) {
      return response(
        res,
        400,
        false,
        "",
        "Los campos (nombre, cantidad, unidad de medida, categoria y sede) son requeridos"
      );
    }

    if (cantidad <= 0) {
      return response(
        res,
        400,
        false,
        "",
        "La cantidad no puede ser menor o igual a 0 "
      );
    }

    if (
      unidadMedida != "kg".toLowerCase() ||
      unidadMedida != "g".toLowerCase() ||
      unidadMedida != "lb".toLowerCase() ||
      unidadMedida != "unidad".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "La undiad de medida solo puede ser (kg, g, lb o unidad)"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
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
        `Sede no encontrada con el id ${sede}`
      );
    }

    const nuevoInventario = await inventarioModel.create(req.body);
    return response(res, 201, true, nuevoInventario, "Inventario creado");
  } catch (error) {
    return handleError(res, error);
  }
};

inventarioController.updateInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cantidad, unidadMedida, categoria, sede } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }
    const inventarioFound = await inventarioModel.findById({ _id: id });
    if (!inventarioFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro inventario con el id ${id}`
      );
    }

    if (!nombre || !cantidad || !unidadMedida || !categoria || !sede) {
      return response(
        res,
        400,
        false,
        "",
        "Los campos (nombre, cantidad, unidad de medida, categoria y sede) son requeridos"
      );
    }

    if (cantidad <= 0) {
      return response(
        res,
        400,
        false,
        "",
        "La cantidad no puede ser menor o igual a 0 "
      );
    }

    if (
      unidadMedida != "kg".toLowerCase() ||
      unidadMedida != "g".toLowerCase() ||
      unidadMedida != "lb".toLowerCase() ||
      unidadMedida != "unidad".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "La undiad de medida solo puede ser (kg, g, lb o unidad)"
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${sede} no es valido para la base de datos`
      );
    }
    if (inventarioFound.sede != sede) {
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

    const inventarioUpdate = await inventarioFound.updateOne(req.body);
    return response(
      res,
      200,
      true,
      inventarioUpdate,
      `Invntario actualziado con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

inventarioController.deleteInventario = async (req, res) => {
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
    const inventarioFound = await inventarioModel.findById({ _id: id });
    if (!inventarioFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro inventario con el id ${id}`
      );
    }

    await inventarioFound.updateOne({ activo: false });
    return response(
      res,
      200,
      true,
      "",
      `Inventario desativado con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** INVENTARIO BY CATEGORIA

inventarioController.getInventarioPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const productos = await inventarioModel.find({ categoria: categoria });
    if (productos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `No hay inventario relacionado a la categoria ${categoria}`
      );
    }

    return response(
      res,
      200,
      true,
      productos,
      `Inventario en la categoría ${categoria}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** INVENTARIO BY SEDE

inventarioController.getInventarioPorSede = async (req, res) => {
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
        `No se encontro la sede con el id ${idSede}`
      );
    }

    const productos = await inventarioModel.find({ sede: idSede });
    return response(
      res,
      200,
      true,
      productos,
      `Inventario de la sede con el id ${idSede}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** INVENTARIO BY ESTADO DISPONIBLE
inventarioController.getInventarioDisponible = async (req, res) => {
  try {
    const disponibles = await inventarioModel.find({
      estado: "disponible".toLowerCase(),
    });
    if (disponibles.length === 0) {
      return response(res, 404, false, "", "No hay productos disponibles");
    }
    return response(
      res,
      200,
      true,
      disponibles,
      "Lista de productos disponibles"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** INVENTARIO BY ESTADO AGOTADO
inventarioController.getInventarioAgotado = async (req, res) => {
  try {
    const agotados = await inventarioModel.find({
      estado: "agotado".toLowerCase(),
    });
    if (agotados.length === 0) {
      return response(res, 404, false, "", "No hay productos agotados");
    }
    return response(res, 200, true, agotados, "Lista de productos agotados");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** INVENTARIO BY ESTADO RESERVADO
inventarioController.getInventarioReservado = async (req, res) => {
  try {
    const reservado = await inventarioModel.find({
      estado: "reservado".toLowerCase(),
    });
    if (reservado.length === 0) {
      return response(res, 404, false, "", "No hay productos reservados");
    }
    return response(res, 200, true, reservado, "Lista de productos reservados");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** INVENTARIO ACTIVO
inventarioController.getInventariosActivos = async (req, res) => {
  try {
    const inventarios = await inventarioModel.find({ activo: true });

    if (inventarios.length === 0) {
      return response(res, 404, false, "", "No hay inventarios activos");
    }

    return response(
      res,
      200,
      true,
      inventarios,
      "Lista de inventarios activos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** INVENTARIO INACTIVO
inventarioController.getInventariosInactivos = async (req, res) => {
  try {
    const inventarios = await inventarioModel.find({ activo: false });

    if (inventarios.length === 0) {
      return response(res, 404, false, "", "No hay inventarios inactivos");
    }

    return response(
      res,
      200,
      true,
      inventarios,
      "Lista de inventarios inactivos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default inventarioController;
