import { Router } from "express";
import paqueteController from "../controllers/paquete.controller.js";
import { authClient } from "../middleware/auth.js";
import { ValidRoles } from "../constants/valid.roles.js";

const paquetesRouter = Router();

paquetesRouter.post(
  "/",
  authClient([ValidRoles.ADMINISTRADOR]),
  paqueteController.postPaquete
);
paquetesRouter.put(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  paqueteController.updatePaquete
);
paquetesRouter.delete(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  paqueteController.deletePaquete
);

paquetesRouter.get(
  "/",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.getPaquetes
);
paquetesRouter.get(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.getPaquetesById
);
paquetesRouter.get(
  "/estado/activos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.getPaquetesActivos
);
paquetesRouter.get(
  "/estado/inactivos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.getPaquetesInactivos
);
paquetesRouter.get(
  "/estado/pendientes",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.paquetesPendientes
);
paquetesRouter.get(
  "/estado/entregados",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.paquetesEntregados
);
paquetesRouter.get(
  "/estado/devueltos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.paquetesDevueltos
);
paquetesRouter.get(
  "/estado/transito",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.paquetesTransito
);
paquetesRouter.get(
  "/sede/:idSede",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.getPaqueteBySede
);
paquetesRouter.get(
  "/envio/:idEnvio",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  paqueteController.getPaqutesByEnvio
);

export default paquetesRouter;
