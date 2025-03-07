import { Router } from "express";
import conductoresController from "../controllers/conductores.controller.js";
import { authClient } from "../middleware/auth.js";
import { ValidRoles } from "../constants/valid.roles.js";

const conductorRouter = Router();

conductorRouter.post(
  "/",
  authClient([ValidRoles.ADMINISTRADOR]),
  conductoresController.postConductor
);
conductorRouter.put(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  conductoresController.updateConductor
);
conductorRouter.delete(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  conductoresController.deleteConductor
);

conductorRouter.get(
  "/",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  conductoresController.getAllConductores
);
conductorRouter.get(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  conductoresController.getConductorById
);
conductorRouter.get(
  "/estado/activos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  conductoresController.getConductoresByActivo
);
conductorRouter.get(
  "/estado/inactivos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  conductoresController.getConductoresInactivos
);
conductorRouter.get(
  "/estado/suspendidos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  conductoresController.getConductoresSuspendidos
);
conductorRouter.get(
  "/estado/ocupados",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  conductoresController.getConductoresOcupados
);
conductorRouter.get(
  "/estado/disponibles",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  conductoresController.getConductoresDisponibles
);
conductorRouter.get(
  "/sede/:idSede",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  conductoresController.getConductoresBySede
);

export default conductorRouter;
