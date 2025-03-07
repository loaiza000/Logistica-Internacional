import { Router } from "express";
import vehiculoController from "../controllers/vehiculo.controller.js";
import { authClient } from "../middleware/auth.js";
import { ValidRoles } from "../constants/valid.roles.js";

const vehiculosRouter = Router();

vehiculosRouter.post(
  "/",
  authClient([ValidRoles.ADMINISTRADOR]),
  vehiculoController.postVehiuclo
);
vehiculosRouter.put(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  vehiculoController.updateVehiuclo
);
vehiculosRouter.delete(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  vehiculoController.deleteVehiculo
);

vehiculosRouter.get(
  "/",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getAllVehiculos
);
vehiculosRouter.get(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiuloById
);
vehiculosRouter.get(
  "/estado/activos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiculosActivos
);
vehiculosRouter.get(
  "/estado/inactivos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiculosInactivos
);
vehiculosRouter.get(
  "/estado/disponibles",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiculosDisponibles
);
vehiculosRouter.get(
  "/estado/mantenimiento",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiculosMantenimiento
);
vehiculosRouter.get(
  "/estado/en-transito",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiculosEnTransito
);
vehiculosRouter.get(
  "/tipo/camion",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiculosCamiones
);
vehiculosRouter.get(
  "/tipo/automovil",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiculosAutomovil
);
vehiculosRouter.get(
  "/placa/:placa",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiculosByPlaca
);
vehiculosRouter.get(
  "/sede/:idSede",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  vehiculoController.getVehiculoBySede
);

export default vehiculosRouter;
