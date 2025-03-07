import { Router } from "express";
import sedeController from "../controllers/sede.controller.js";
import { authClient } from "../middleware/auth.js";
import { ValidRoles } from "../constants/valid.roles.js";

const sedesRouter = Router();

sedesRouter.post(
  "/",
  authClient([ValidRoles.ADMINISTRADOR]),
  sedeController.postSede
);
sedesRouter.put(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  sedeController.putSede
);
sedesRouter.delete(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  sedeController.deleteSede
);

sedesRouter.get(
  "/",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  sedeController.getAllSedes
);
sedesRouter.get(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  sedeController.getSedeById
);
sedesRouter.get(
  "/estado/activas",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  sedeController.getSedesActivas
);
sedesRouter.get(
  "/estado/inactivas",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  sedeController.getSedesInactivas
);
sedesRouter.get(
  "/nombre",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  sedeController.getSedeByNombre
);
sedesRouter.get(
  "/vehiculos/:idSede",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  sedeController.getVehiculosBySede
);
sedesRouter.get(
  "/conductores/:idSede",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  sedeController.getConductoresBySede
);
sedesRouter.get(
  "/paquetes/:idSede",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  sedeController.getPaquetesBySede
);
sedesRouter.get(
  "/usuarios/:idSede",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  sedeController.getUsuariosBySede
);

export default sedesRouter;
