import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import facultyRoutes from "./facultyRoutes.js";
import logRoutes from "./logRoutes.js";
import studentRoutes from "./studentRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/faculty", facultyRoutes);
router.use("/student", studentRoutes);
router.use("/logs", logRoutes);

export default router;
