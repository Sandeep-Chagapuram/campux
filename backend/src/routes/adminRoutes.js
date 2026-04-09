import { Router } from "express";
import { body } from "express-validator";
import {
  createBranch,
  deleteBranch,
  deleteFaculty,
  deleteSection,
  deleteStudent,
  createFaculty,
  createSection,
  createStudent,
  listMasterData,
  setPeriodConfig,
  updateBranch,
  updateFaculty,
  updateSection,
  updateStudent
} from "../controllers/adminController.js";
import { authorize, protect, requirePasswordUpdated } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(protect, requirePasswordUpdated, authorize(ROLES.ADMIN));

router.get("/master-data", listMasterData);
router.post(
  "/branches",
  [body("name").notEmpty(), body("code").notEmpty()],
  validateRequest,
  createBranch
);
router.put("/branches/:id", updateBranch);
router.delete("/branches/:id", deleteBranch);
router.post(
  "/sections",
  [body("name").notEmpty(), body("branch").notEmpty(), body("semester").isInt({ min: 1, max: 8 })],
  validateRequest,
  createSection
);
router.put("/sections/:id", updateSection);
router.delete("/sections/:id", deleteSection);
router.post("/faculty", createFaculty);
router.put("/faculty/:id", updateFaculty);
router.delete("/faculty/:id", deleteFaculty);
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);
router.put(
  "/config/periods",
  [body("periodsPerDay").isInt({ min: 1, max: 12 })],
  validateRequest,
  setPeriodConfig
);

export default router;
