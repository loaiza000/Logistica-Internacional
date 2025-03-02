import { Router } from "express";
import usaurioController from "../controllers/usuario.controller.js";

const usuariosRouter = Router();

usuariosRouter.get("/", usaurioController.getAllUsers);
usuariosRouter.get("/:idUser", usaurioController.getUseryId);
usuariosRouter.post("/", usaurioController.postUsuario);
usuariosRouter.post("/admin", usaurioController.postAdmin);
usuariosRouter.put("/:idUser", usaurioController.putUsuario);
usuariosRouter.delete("/:id", usaurioController.deleteUser);

// Rutas adicionales
usuariosRouter.get("/nombre/:nombre", usaurioController.getUserNombre);
usuariosRouter.get("/estado/activos", usaurioController.usersActive);
usuariosRouter.get("/estado/inactivos", usaurioController.userInactive);
usuariosRouter.post("/login", usaurioController.looginUser);

export default usuariosRouter;
