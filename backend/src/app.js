import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "college-management-backend" });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
