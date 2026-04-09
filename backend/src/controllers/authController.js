import { User } from "../models/User.js";
import { generateToken } from "../services/jwtService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const normalized = String(identifier || "").trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: normalized }, { username: normalized }]
  }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = generateToken({ userId: user._id, role: user.role });

  res.status(200).json({
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      mustChangePassword: user.mustChangePassword,
      role: user.role,
      subRole: user.subRole
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new passwords are required");
  }
  if (newPassword.length < 5) {
    throw new ApiError(400, "New password must be at least 5 characters");
  }

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, "Current password is incorrect");

  user.password = newPassword;
  user.mustChangePassword = false;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});
