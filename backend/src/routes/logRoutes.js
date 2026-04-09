import { Router } from "express";
import { getDailyLogs } from "../controllers/logController.js";
import { authorize, protect, requirePasswordUpdated } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(protect, requirePasswordUpdated, authorize(ROLES.ADMIN, ROLES.FACULTY));
router.get("/", getDailyLogs);

export default router;
