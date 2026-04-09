import { ROLES } from "../constants/roles.js";
import { User } from "../models/User.js";

export const ensureDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ $or: [{ username: "admin" }, { role: ROLES.ADMIN }] });
  if (existingAdmin) return;

  await User.create({
    fullName: "System Administrator",
    username: "admin",
    email: "admin@local.com",
    password: "admin",
    role: ROLES.ADMIN
  });

  console.log("Default admin created: username=admin, password=admin");
};
