import { Router } from "express";
import { body } from "express-validator";
import {
  createPermissionRequest,
  decidePermissionRequest,
  downloadPermissionPdf,
  listAllPermissionRequests,
  listMyPermissionRequests
} from "../controllers/permissionController.js";
import { authorize, protect, requirePasswordUpdated } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.post(
  "/student",
  protect,
  requirePasswordUpdated,
  authorize(ROLES.STUDENT),
  [body("subject").notEmpty(), body("body").notEmpty()],
  validateRequest,
  createPermissionRequest
);
router.get(
  "/student",
  protect,
  requirePasswordUpdated,
  authorize(ROLES.STUDENT),
  listMyPermissionRequests
);
router.get(
  "/student/:id/pdf",
  protect,
  requirePasswordUpdated,
  authorize(ROLES.STUDENT),
  downloadPermissionPdf
);

router.get(
  "/admin",
  protect,
  requirePasswordUpdated,
  authorize(ROLES.ADMIN),
  listAllPermissionRequests
);
router.patch(
  "/admin/:id/decision",
  protect,
  requirePasswordUpdated,
  authorize(ROLES.ADMIN),
  [body("decision").notEmpty()],
  validateRequest,
  decidePermissionRequest
);
router.get(
  "/admin/:id/pdf",
  protect,
  requirePasswordUpdated,
  authorize(ROLES.ADMIN),
  downloadPermissionPdf
);

export default router;
