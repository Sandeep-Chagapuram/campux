import { Router } from "express";
import { getStudentDashboard } from "../controllers/studentController.js";
import { authorize, protect, requirePasswordUpdated } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(protect, requirePasswordUpdated, authorize(ROLES.STUDENT));
router.get("/dashboard", getStudentDashboard);

export default router;
