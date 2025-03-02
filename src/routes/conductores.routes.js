import { Router } from "express";
import conductoresController from "../controllers/conductores.controller.js";

const conductorRouter = Router();

conductorRouter.get("/", conductoresController.getAllConductores);
conductorRouter.get("/:id", conductoresController.getConductorById);
conductorRouter.post("/", conductoresController.postConductor);
conductorRouter.put("/:id", conductoresController.updateConductor);
conductorRouter.delete("/:id", conductoresController.deleteConductor);

// Rutas adicionales
conductorRouter.get(
  "/estado/activos",
  conductoresController.getConductoresByActivo
);
conductorRouter.get(
  "/estado/inactivos",
  conductoresController.getConductoresInactivos
);
conductorRouter.get(
  "/estado/suspendidos",
  conductoresController.getConductoresSuspendidos
);
conductorRouter.get(
  "/estado/ocupados",
  conductoresController.getConductoresOcupados
);
conductorRouter.get(
  "/estado/disponibles",
  conductoresController.getConductoresDisponibles
);
conductorRouter.get(
  "/sede/:idSede",
  conductoresController.getConductoresBySede
);

export default conductorRouter;
