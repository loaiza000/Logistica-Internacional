import { Router } from "express";
import pagosController from "../controllers/pagos.controller.js";

const pagosRouter = Router();

// Obtener todos los pagos
pagosRouter.get("/", pagosController.getAllPagos);

// Obtener pago por ID
pagosRouter.get("/:id", pagosController.getPagosById);

// Crear nuevo pago
pagosRouter.post("/", pagosController.postPatgo);

// Actualizar pago
pagosRouter.put("/:id", pagosController.updatePago);

// Eliminar pago (desactivado, no eliminado)
pagosRouter.delete("/:id", pagosController.deletePago);

// Obtener pagos por estado
pagosRouter.get("/estado/cancelado", pagosController.getPagosCancelado);
pagosRouter.get("/estado/pagado", pagosController.getPagosPagado);
pagosRouter.get("/estado/pendiente", pagosController.getPagosPendiente);

// Obtener pagos por método de pago
pagosRouter.get("/metodo/paypal", pagosController.getPagosByPaypal);
pagosRouter.get("/metodo/tarjeta", pagosController.getPagosByTarjeta);
pagosRouter.get("/metodo/efectivo", pagosController.getPagosByEfectivo);
pagosRouter.get(
  "/metodo/transferencia",
  pagosController.getPagosByTransferencia
);

// Pagos por usuario
pagosRouter.get("/pagosUsuario", pagosController.pagosByUser)

export default pagosRouter;
