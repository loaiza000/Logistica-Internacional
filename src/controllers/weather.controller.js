import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";

const weatherController = {};

weatherController.getWeatherForLocation = async (req, res) => {
  try {
    const { latitud, longitud } = req.query;

    if (!latitud || !longitud) {
      return response(res, 400, false, "", "Se requieren latitud y longitud");
    }

    const weatherData = await weatherService.getWeatherByCoordinates(
      parseFloat(latitud),
      parseFloat(longitud)
    );

    return response(
      res,
      200,
      true,
      "",
      `Datos del clima obtenidos exitosamente: ${weatherData}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

weatherController.checkRouteWeather = async (req, res) => {
  try {
    const { puntos } = req.body;

    if (!puntos || !Array.isArray(puntos) || puntos.length === 0) {
      return errorResponse(
        res,
        400,
        "Se requiere un array de puntos con lat y lon"
      );
    }

    const routeWeather = await weatherService.verificarRutaCompleta(puntos);
    return response(
      res,
      200,
      true,
      "",
      `Análisis de ruta completado ${routeWeather}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default weatherController;
