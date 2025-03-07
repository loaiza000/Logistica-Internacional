import { Router } from "express";
import inventarioController from "../controllers/inventario.controller.js";
import { authClient } from "../middleware/auth.js";
import { ValidRoles } from "../constants/valid.roles.js";

const inventarioRouter = Router();

inventarioRouter.get(
  "/",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  inventarioController.getAllInventario
);
inventarioRouter.get(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  inventarioController.getInventarioById
);
inventarioRouter.get(
  "/categoria/:categoria",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  inventarioController.getInventarioPorCategoria
);
inventarioRouter.get(
  "/sede/:idSede",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  inventarioController.getInventarioPorSede
);

inventarioRouter.get(
  "/estado/disponible",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  inventarioController.getInventarioDisponible
);
inventarioRouter.get(
  "/estado/agotado",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  inventarioController.getInventarioAgotado
);
inventarioRouter.get(
  "/estado/reservado",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  inventarioController.getInventarioReservado
);

inventarioRouter.get(
  "/activo",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  inventarioController.getInventariosActivos
);
inventarioRouter.get(
  "/inactivo",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  inventarioController.getInventariosInactivos
);

inventarioRouter.post(
  "/",
  authClient([ValidRoles.ADMINISTRADOR]),
  inventarioController.postInventario
);
inventarioRouter.put(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  inventarioController.updateInventario
);
inventarioRouter.delete(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  inventarioController.deleteInventario
);

export default inventarioRouter;
