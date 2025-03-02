import jsonwebtoken from "jsonwebtoken";

export const generateToken = (payload) => {
  try {
    const token = jsonwebtoken.sign(payload, "123", {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    console.log("Error al generar el token", error.message);
  }
};
