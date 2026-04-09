import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  email: {
    host: process.env.EMAIL_HOST || "",
    port: Number(process.env.EMAIL_PORT || 587),
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
    from: process.env.EMAIL_FROM || "no-reply@college.com"
  },
  whatsappEnabled: String(process.env.WHATSAPP_ENABLED).toLowerCase() === "true",
  whatsappDelayMs: Number(process.env.WHATSAPP_SEND_DELAY_MS || 3500),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};
