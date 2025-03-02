import { Router } from "express";
import sedeController from "../controllers/sede.controller.js";

const sedesRouter = Router();

sedesRouter.get("/", sedeController.getAllSedes);
sedesRouter.get("/:id", sedeController.getSedeById);
sedesRouter.post("/", sedeController.postSede);
sedesRouter.put("/:id", sedeController.putSede);
sedesRouter.delete("/:id", sedeController.deleteSede);

// Rutas adicionales
sedesRouter.get("/estado/activas", sedeController.getSedesActivas);
sedesRouter.get("/estado/inactivas", sedeController.getSedesInactivas);
sedesRouter.get("/nombre", sedeController.getSedeByNombre);
sedesRouter.get("/vehiculos/:idSede", sedeController.getVehiculosBySede);
sedesRouter.get("/conductores/:idSede", sedeController.getConductoresBySede);
sedesRouter.get("/paquetes/:idSede", sedeController.getPaquetesBySede);
sedesRouter.get("/usuarios/:idSede", sedeController.getUsuariosBySede);

export default sedesRouter;
