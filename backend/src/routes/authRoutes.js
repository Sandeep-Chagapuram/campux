import { Router } from "express";
import { body } from "express-validator";
import { changePassword, login, me } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/login",
  [
    body("identifier").notEmpty().withMessage("Username or email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  login
);

router.get("/me", protect, me);
router.post("/change-password", protect, changePassword);

export default router;
