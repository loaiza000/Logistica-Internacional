import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
connectDB();

import conductorRouter from "./routes/conductores.routes.js";
import enviosRouter from "./routes/envios.routes.js";
import paquetesRouter from "./routes/paquetes.routes.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import sedesRouter from "./routes/sedes.routes.js";
import vehciulosRouter from "./routes/vehiculos.routes.js";
import sendEmailRouter from "./routes/sendEmail.routes.js";
import pagosRouter from "./routes/pagos.routes.js";
import inventarioRouter from "./routes/inventarios.routes.js";
import weatherRouter from "./routes/weather.routes.js";

dotenv.config();

const app = express();

app.set("port", process.env.PORT);
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/conductor", conductorRouter);
app.use("/envios", enviosRouter);
app.use("/paquetes", paquetesRouter);
app.use("/usuario", usuariosRouter);
app.use("/sedes", sedesRouter);
app.use("/vehiculos", vehciulosRouter);
app.use("/sendEmail", sendEmailRouter);
app.use("/pagos", pagosRouter);
app.use("/inventarios", inventarioRouter);
app.use("/weather", weatherRouter);

app.listen(app.get("port"), () => {
  console.log("Escuchando por el puerto", app.get("port"));
});
