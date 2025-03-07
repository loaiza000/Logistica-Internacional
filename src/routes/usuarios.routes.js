import { Router } from "express";
import usaurioController from "../controllers/usuario.controller.js";
import { authClient } from "../middleware/auth.js";
import { ValidRoles } from "../constants/valid.roles.js";

const usuariosRouter = Router();

usuariosRouter.post(
  "/",
  authClient([ValidRoles.ADMINISTRADOR]),
  usaurioController.postUsuario
);
usuariosRouter.post(
  "/admin",
  authClient([ValidRoles.ADMINISTRADOR]),
  usaurioController.postAdmin
);
usuariosRouter.put(
  "/:idUser",
  authClient([ValidRoles.ADMINISTRADOR]),
  usaurioController.putUsuario
);
usuariosRouter.delete(
  "/:id",
  authClient([ValidRoles.ADMINISTRADOR]),
  usaurioController.deleteUser
);

usuariosRouter.get(
  "/",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  usaurioController.getAllUsers
);
usuariosRouter.get(
  "/:idUser",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  usaurioController.getUseryId
);
usuariosRouter.get(
  "/nombre/:nombre",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  usaurioController.getUserNombre
);
usuariosRouter.get(
  "/estado/activos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  usaurioController.usersActive
);
usuariosRouter.get(
  "/estado/inactivos",
  authClient([ValidRoles.ADMINISTRADOR, ValidRoles.OPERADOR]),
  usaurioController.userInactive
);

usuariosRouter.post("/login", usaurioController.looginUser);

export default usuariosRouter;
