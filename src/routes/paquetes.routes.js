import { Router } from "express";
import paqueteController from "../controllers/paquete.controller.js";

const paquetesRouter = Router();

paquetesRouter.get("/", paqueteController.getPaquetes);
paquetesRouter.get("/:id", paqueteController.getPaquetesById);
paquetesRouter.post("/", paqueteController.postPaquete);
paquetesRouter.put("/:id", paqueteController.updatePaquete);
paquetesRouter.delete("/:id", paqueteController.deletePaquete);

// Rutas adicionales
paquetesRouter.get("/estado/activos", paqueteController.getPaquetesActivos);
paquetesRouter.get("/estado/inactivos", paqueteController.getPaquetesInactivos);
paquetesRouter.get("/estado/pendientes", paqueteController.paquetesPendientes);
paquetesRouter.get("/estado/entregados", paqueteController.paquetesEntregados);
paquetesRouter.get("/estado/devueltos", paqueteController.paquetesDevueltos);
paquetesRouter.get("/estado/transito", paqueteController.paquetesTransito);
paquetesRouter.get("/sede/:idSede", paqueteController.getPaqueteBySede);
paquetesRouter.get("/envio/:idEnvio", paqueteController.getPaqutesByEnvio);

export default paquetesRouter;
