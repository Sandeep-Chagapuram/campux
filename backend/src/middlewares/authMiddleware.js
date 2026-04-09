import { User } from "../models/User.js";
import { verifyToken } from "../services/jwtService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid user");
  }

  req.user = user;
  next();
});

export const requirePasswordUpdated = (req, res, next) => {
  if (req.user.mustChangePassword) {
    throw new ApiError(403, "Password change required before accessing this resource");
  }
  next();
};

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: insufficient permission");
  }
  next();
};
