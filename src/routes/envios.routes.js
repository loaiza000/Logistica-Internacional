import { Router } from "express";
import enviosController from "../controllers/envios.controller.js";

const enviosRouter = Router();

enviosRouter.get("/", enviosController.getAllEnvios);
enviosRouter.get("/:id", enviosController.getEnviosById);
enviosRouter.post("/", enviosController.postEnvio);
enviosRouter.put("/:id", enviosController.updateEnvio);
enviosRouter.delete("/:id", enviosController.deleteEnvio);

// Rutas adicionales
enviosRouter.get("/estado/pendientes", enviosController.getEnviosPendientes);
enviosRouter.get("/estado/cancelados", enviosController.getEnviosCancelados);
enviosRouter.get("/estado/entregados", enviosController.getEnviosEntregados);
enviosRouter.get("/estado/camino", enviosController.getEnviosEnCamino);
enviosRouter.get(
  "/conductor/:idConductor",
  enviosController.getEnviosByConductor
);
enviosRouter.get("/vehiculo/:idVehiculo", enviosController.getEnviosByVehiculo);
enviosRouter.get("/tipo/nacional", enviosController.getEnviosNacionales);
enviosRouter.get(
  "/tipo/internacional",
  enviosController.getEnviosInternacionales
);
enviosRouter.post("/simularCosto", enviosController.simulateCosto);

export default enviosRouter;
