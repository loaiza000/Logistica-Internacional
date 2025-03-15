import jsonwebtoken from "jsonwebtoken";
import { response } from "../helpers/response.js";
import { usuarioModel } from "../models/usuario.model.js";

const messageNoAuth = (res) => {
  return response(res, 401, false, "No esta autorizado");
};

export const authClient = (roles) => {
  return (req, res, next) => {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" "[1]);
      jsonwebtoken.verify(token, process.env.SECRET, async (error, payload) => {
        if (error) {
          return messageNoAuth(res);
        }

        const user = await usuarioModel.findById({ _id: payload.user });
        if (!user) {
          return messageNoAuth(res);
        }

        // ** verificar roles
        if (roles.includes(user.rol)) {
          req.userId = payload.user;
          next();
        }else{
          return response(res,400,false,`Necesitas un rol valido [${roles}]`)
        }
      });
    }

    if (!token) {
      return messageNoAuth(res);
    }
  };
};
