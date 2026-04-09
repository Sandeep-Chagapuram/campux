import { env } from "../config/env.js";

export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
    details: err.details || undefined,
    stack: env.nodeEnv === "development" ? err.stack : undefined
  });
};
