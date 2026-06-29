import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 8000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  NODE_ENV: process.env.NODE_ENV || "development",
  SALT_ROUNDS: 10,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  ENTRA_CLIENT_SECRET: process.env.ENTRA_CLIENT_SECRET,
  ENTRA_TENANT_ID: process.env.ENTRA_TENANT_ID,
  ENTRA_CLIENT_ID: process.env.ENTRA_CLIENT_ID,
  ENTRA_REDIRECT_URI: process.env.ENTRA_REDIRECT_URI,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
