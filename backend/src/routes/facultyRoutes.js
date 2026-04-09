import { Router } from "express";
import { body } from "express-validator";
import {
  createStudentByFaculty,
  getFacultyScope,
  getStudentsForAttendance,
  markAttendance
} from "../controllers/facultyController.js";
import { authorize, protect, requirePasswordUpdated } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(protect, requirePasswordUpdated, authorize(ROLES.FACULTY));

router.get("/scope", getFacultyScope);
router.get("/students/:sectionId", getStudentsForAttendance);
router.post("/students", createStudentByFaculty);
router.post(
  "/attendance",
  [
    body("date").isISO8601().withMessage("Valid attendance date is required"),
    body("branch").notEmpty(),
    body("section").notEmpty(),
    body("periodNumber").isInt({ min: 1 }),
    body("entries").isArray({ min: 1 })
  ],
  validateRequest,
  markAttendance
);

export default router;
