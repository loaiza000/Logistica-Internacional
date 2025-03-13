import { Router } from "express";
import weatherController from "../controllers/weather.controller.js";
import { authClient } from "../middleware/auth.js";

const weatherRouter = Router();

// ** Obtener clima por coordenadas
weatherRouter.get(
  "/location",
  authClient,
  weatherController.getWeatherForLocation
);

// ** Verificar clima en una ruta completa
weatherRouter.post(
  "/route-check",
  authClient,
  weatherController.checkRouteWeather
);

export default weatherRouter;
