import { Router } from "express";
import vehiculoController from "../controllers/vehiculo.controller.js";

const vehciulosRouter = Router();

vehciulosRouter.get("/", vehiculoController.getAllVehiculos);
vehciulosRouter.get("/:id", vehiculoController.getVehiuloById);
vehciulosRouter.post("/", vehiculoController.postVehiuclo);
vehciulosRouter.put("/:id", vehiculoController.updateVehiuclo);
vehciulosRouter.delete("/:id", vehiculoController.deleteVehiculo);

// Rutas adicionales
vehciulosRouter.get("/estado/activos", vehiculoController.getVehiculosActivos);
vehciulosRouter.get(
  "/estado/inactivos",
  vehiculoController.getVehiculosInactivos
);
vehciulosRouter.get(
  "/estado/disponibles",
  vehiculoController.getVehiculosDisponibles
);
vehciulosRouter.get(
  "/estado/mantenimiento",
  vehiculoController.getVehiculosMantenimiento
);
vehciulosRouter.get(
  "/estado/en-transito",
  vehiculoController.getVehiculosEnTransito
);
vehciulosRouter.get("/tipo/camion", vehiculoController.getVehiculosCamiones);
vehciulosRouter.get(
  "/tipo/automovil",
  vehiculoController.getVehiculosAutomovil
);
vehciulosRouter.get("/placa/:placa", vehiculoController.getVehiculosByPlaca);
vehciulosRouter.get("/sede/:idSede", vehiculoController.getVehiculoBySede);

export default router;
