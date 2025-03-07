import { Router } from "express";
import enviosController from "../controllers/envios.controller.js";
import { authClient } from "../middleware/auth.js";
import { ValidRoles } from "../constants/valid.roles.js";

const enviosRouter = Router();

enviosRouter.post(
  "/",
  authClient([ValidRoles.ADMINISTRADOR]),
  enviosController.postEnvio
);
enviosRouter.put(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  enviosController.updateEnvio
);
enviosRouter.delete(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  enviosController.deleteEnvio
);

enviosRouter.get(
  "/",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getAllEnvios
);
enviosRouter.get(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getEnviosById
);
enviosRouter.get(
  "/estado/pendientes",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getEnviosPendientes
);
enviosRouter.get(
  "/estado/cancelados",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getEnviosCancelados
);
enviosRouter.get(
  "/estado/entregados",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getEnviosEntregados
);
enviosRouter.get(
  "/estado/camino",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getEnviosEnCamino
);
enviosRouter.get(
  "/conductor/:idConductor",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getEnviosByConductor
);
enviosRouter.get(
  "/vehiculo/:idVehiculo",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getEnviosByVehiculo
);
enviosRouter.get(
  "/tipo/nacional",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getEnviosNacionales
);
enviosRouter.get(
  "/tipo/internacional",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.getEnviosInternacionales
);

enviosRouter.post(
  "/simularCosto",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  enviosController.simulateCosto
);

export default enviosRouter;
