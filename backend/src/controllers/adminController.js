import { Branch } from "../models/Branch.js";
import { Faculty } from "../models/Faculty.js";
import { Section } from "../models/Section.js";
import { Student } from "../models/Student.js";
import { SystemConfig } from "../models/SystemConfig.js";
import { User } from "../models/User.js";
import { ROLES } from "../constants/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json(branch);
});

export const createSection = asyncHandler(async (req, res) => {
  const section = await Section.create(req.body);
  res.status(201).json(section);
});

export const updateBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(branch);
});

export const deleteBranch = asyncHandler(async (req, res) => {
  await Branch.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export const updateSection = asyncHandler(async (req, res) => {
  const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(section);
});

export const deleteSection = asyncHandler(async (req, res) => {
  await Section.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export const createFaculty = asyncHandler(async (req, res) => {
  const { fullName, email, phone, employeeId, branches = [], sections = [] } = req.body;
  const defaultPassword = email;
  const user = await User.create({
    fullName,
    username: email,
    email,
    password: defaultPassword,
    mustChangePassword: true,
    phone,
    role: ROLES.FACULTY
  });
  const faculty = await Faculty.create({ user: user._id, employeeId, branches, sections });
  res.status(201).json({
    faculty,
    defaultCredentials: { username: email, password: defaultPassword }
  });
});

export const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findByIdAndDelete(req.params.id);
  if (faculty) {
    await User.findByIdAndDelete(faculty.user);
  }
  res.status(204).send();
});

export const updateFaculty = asyncHandler(async (req, res) => {
  const { fullName, email, phone, employeeId, branches, sections } = req.body;
  const faculty = await Faculty.findById(req.params.id);
  if (!faculty) return res.status(404).json({ message: "Faculty not found" });

  const user = await User.findById(faculty.user);
  if (!user) return res.status(404).json({ message: "Faculty user not found" });

  if (fullName !== undefined) user.fullName = fullName;
  if (email !== undefined) {
    user.email = email;
    user.username = email;
  }
  if (phone !== undefined) user.phone = phone;
  await user.save();

  if (employeeId !== undefined) faculty.employeeId = employeeId;
  if (branches !== undefined) faculty.branches = branches;
  if (sections !== undefined) faculty.sections = sections;
  await faculty.save();

  const updatedFaculty = await Faculty.findById(faculty._id).populate("user", "fullName email phone");
  res.status(200).json(updatedFaculty);
});

export const createStudent = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    rollNumber,
    registrationNumber,
    branch,
    section,
    parentName,
    parentPhone,
    parentEmail
  } = req.body;
  const defaultPassword = email;
  const user = await User.create({
    fullName,
    username: email,
    email,
    password: defaultPassword,
    mustChangePassword: true,
    phone,
    role: ROLES.STUDENT
  });
  const student = await Student.create({
    user: user._id,
    rollNumber,
    registrationNumber,
    branch,
    section,
    parentName,
    parentPhone,
    parentEmail
  });
  res.status(201).json({
    student,
    defaultCredentials: { username: email, password: defaultPassword }
  });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    rollNumber,
    registrationNumber,
    branch,
    section,
    parentName,
    parentPhone,
    parentEmail
  } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const user = await User.findById(student.user);
  if (!user) return res.status(404).json({ message: "Student user not found" });

  if (fullName !== undefined) user.fullName = fullName;
  if (email !== undefined) {
    user.email = email;
    user.username = email;
  }
  if (phone !== undefined) user.phone = phone;
  await user.save();

  if (rollNumber !== undefined) student.rollNumber = rollNumber;
  if (registrationNumber !== undefined) student.registrationNumber = registrationNumber;
  if (branch !== undefined) student.branch = branch;
  if (section !== undefined) student.section = section;
  if (parentName !== undefined) student.parentName = parentName;
  if (parentPhone !== undefined) student.parentPhone = parentPhone;
  if (parentEmail !== undefined) student.parentEmail = parentEmail;
  await student.save();

  const updatedStudent = await Student.findById(student._id)
    .populate("user", "fullName email phone")
    .populate("branch", "name code")
    .populate("section", "name semester");
  res.status(200).json(updatedStudent);
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (student) {
    await User.findByIdAndDelete(student.user);
  }
  res.status(204).send();
});

export const listMasterData = asyncHandler(async (req, res) => {
  const [branches, sections, students, faculty] = await Promise.all([
    Branch.find().sort({ code: 1 }),
    Section.find().populate("branch", "name code"),
    Student.find().populate("user", "fullName email").populate("branch", "name").populate("section", "name"),
    Faculty.find().populate("user", "fullName email")
  ]);
  res.status(200).json({ branches, sections, students, faculty });
});

export const setPeriodConfig = asyncHandler(async (req, res) => {
  const { periodsPerDay } = req.body;
  const config = await SystemConfig.findOneAndUpdate(
    { key: "periods_per_day" },
    { key: "periods_per_day", value: periodsPerDay },
    { upsert: true, new: true }
  );
  res.status(200).json(config);
});
