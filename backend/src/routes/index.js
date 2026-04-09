import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import facultyRoutes from "./facultyRoutes.js";
import logRoutes from "./logRoutes.js";
import permissionRoutes from "./permissionRoutes.js";
import studentRoutes from "./studentRoutes.js";
import { verifyPermissionDocument } from "../controllers/permissionController.js";

const router = Router();

router.get("/verify/:approvalId", verifyPermissionDocument);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/faculty", facultyRoutes);
router.use("/student", studentRoutes);
router.use("/logs", logRoutes);
router.use("/permissions", permissionRoutes);

export default router;
