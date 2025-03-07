import { Router } from "express";
import pagosController from "../controllers/pagos.controller.js";
import { authClient } from "../middleware/auth.js";
import { ValidRoles } from "../constants/valid.roles.js";

const pagosRouter = Router();

pagosRouter.post(
  "/",
  authClient([ValidRoles.ADMINISTRADOR]),
  pagosController.postPatgo
);
pagosRouter.put(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  pagosController.updatePago
);
pagosRouter.delete(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  pagosController.deletePago
);

pagosRouter.get(
  "/",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.getAllPagos
);
pagosRouter.get(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.getPagosById
);
pagosRouter.get(
  "/estado/cancelado",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.getPagosCancelado
);
pagosRouter.get(
  "/estado/pagado",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.getPagosPagado
);
pagosRouter.get(
  "/estado/pendiente",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.getPagosPendiente
);
pagosRouter.get(
  "/metodo/paypal",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.getPagosByPaypal
);
pagosRouter.get(
  "/metodo/tarjeta",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.getPagosByTarjeta
);
pagosRouter.get(
  "/metodo/efectivo",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.getPagosByEfectivo
);
pagosRouter.get(
  "/metodo/transferencia",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.getPagosByTransferencia
);

pagosRouter.get(
  "/pagosUsuario",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  pagosController.pagosByUser
);

export default pagosRouter;
