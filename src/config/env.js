import dotenv from "dotenv";

dotenv.config();

export const config = {
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  db: process.env.DB_URI,
  port: process.env.PORT,
  apikey: process.env.OPENWEATHER_API_KEY,
};
