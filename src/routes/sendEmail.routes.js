import { Router } from "express";
import sendEmailController from "../controllers/sendEmail.controller.js";
import { authClient } from "../middleware/auth.js";
import { ValidRoles } from "../constants/valid.roles.js";

const sendEmailRouter = Router();

sendEmailRouter.post(
  "/enviar",
  authClient([ValidRoles.ADMINISTRADOR]),
  sendEmailController.sendEmail
);

export default sendEmailRouter;
