import axios from "axios";
import NodeCache from "node-cache";
import { handleError } from "../helpers/error.handler.js";
import dotenv from "dotenv";

dotenv.config();

const weatherCache = new NodeCache({ stdTTL: 1800 }); // ** Cache por 30 minutos

const weatherService = {};

weatherService.getWeatherByCoordinates = async (lat, lon) => {
  const cacheKey = `weather_${lat}_${lon}`;
  const cachedData = weatherCache.get(cacheKey);

  if (cachedData) return cachedData;

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
          lang: "es",
        },
      }
    );

    const weatherData = {
      temperatura: response.data.main.temp,
      condicion: response.data.weather[0].description,
      viento: response.data.wind.speed,
      alertas: evaluarCondicionesClimaticas(response.data),
    };

    weatherCache.set(cacheKey, weatherData);
    return weatherData;
  } catch (error) {
    return handleError(res, error);
  }
};

const evaluarCondicionesClimaticas = (data) => {
  const alertas = [];

  // Evaluar condiciones extremas
  if (data.main.temp > 35) {
    alertas.push("Temperatura extremadamente alta");
  }
  if (data.wind.speed > 20) {
    alertas.push("Vientos fuertes");
  }
  if (data.weather[0].main === "Rain" || data.weather[0].main === "Snow") {
    alertas.push(
      `Condiciones de ${data.weather[0].main === "Rain" ? "lluvia" : "nieve"}`
    );
  }

  return alertas;
};

weatherService.verificarRutaCompleta = async (puntos) => {
  try {
    const resultados = await Promise.all(
      puntos.map((punto) =>
        weatherService.getWeatherByCoordinates(punto.lat, punto.lon)
      )
    );

    return {
      condicionesRuta: resultados,
      tieneAlertas: resultados.some((r) => r.alertas.length > 0),
      alertasGenerales: resultados
        .flatMap((r) => r.alertas)
        .filter((v, i, a) => a.indexOf(v) === i),
    };
  } catch (error) {
    return handleError(res, error);
  }
};

export default weatherService;
