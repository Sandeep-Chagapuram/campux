import { PermissionRequest } from "../models/PermissionRequest.js";
import { Student } from "../models/Student.js";
import { ROLES } from "../constants/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { buildPermissionPdf } from "../services/permissionPdfService.js";

const makeApprovalId = () =>
  `APR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const createPermissionRequest = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) throw new ApiError(404, "Student profile not found");

  const { subject, body, fromDate, toDate, durationText } = req.body;
  const request = await PermissionRequest.create({
    student: student._id,
    subject,
    body,
    fromDate: fromDate || null,
    toDate: toDate || null,
    durationText: durationText || ""
  });
  res.status(201).json(request);
});

export const listMyPermissionRequests = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) throw new ApiError(404, "Student profile not found");
  const requests = await PermissionRequest.find({ student: student._id }).sort({ createdAt: -1 });
  res.status(200).json(requests);
});

export const listAllPermissionRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status && ["pending", "approved", "rejected"].includes(status)) query.status = status;

  const requests = await PermissionRequest.find(query)
    .populate({
      path: "student",
      populate: { path: "user", select: "fullName email" },
      select: "rollNumber"
    })
    .populate("approvedBy", "fullName role subRole")
    .sort({ createdAt: -1 });

  res.status(200).json(requests);
});

export const decidePermissionRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { decision, rejectionReason } = req.body;
  if (!["approved", "rejected"].includes(decision)) {
    throw new ApiError(400, "Decision must be approved or rejected");
  }

  const request = await PermissionRequest.findById(id);
  if (!request) throw new ApiError(404, "Permission request not found");
  if (request.status !== "pending") throw new ApiError(400, "Request already processed");

  request.status = decision;
  if (decision === "approved") {
    request.approvalId = makeApprovalId();
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();
    request.rejectionReason = "";
  } else {
    request.rejectionReason = rejectionReason || "Not approved";
  }
  await request.save();

  res.status(200).json(request);
});

export const downloadPermissionPdf = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const request = await PermissionRequest.findById(id).populate("approvedBy", "fullName role subRole");
  if (!request) throw new ApiError(404, "Permission request not found");
  if (request.status !== "approved" || !request.approvalId) {
    throw new ApiError(400, "PDF available only for approved requests");
  }

  if (req.user.role === ROLES.STUDENT) {
    const student = await Student.findOne({ user: req.user._id });
    if (!student || String(student._id) !== String(request.student)) {
      throw new ApiError(403, "Forbidden");
    }
  }

  const student = await Student.findById(request.student).populate("user", "fullName email");
  if (!student) throw new ApiError(404, "Student profile not found");

  const designation = request.approvedBy?.subRole
    ? request.approvedBy.subRole.replaceAll("_", " ")
    : "Admin/HOD";
  const pdfBuffer = await buildPermissionPdf({
    request,
    student,
    approvedByName: request.approvedBy?.fullName || "Admin",
    approvedByDesignation: designation
  });

  const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Length", String(buffer.length));
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="permission-letter-${request.approvalId}.pdf"`
  );
  res.status(200).send(buffer);
});

export const verifyPermissionDocument = asyncHandler(async (req, res) => {
  const { approvalId } = req.params;
  const request = await PermissionRequest.findOne({ approvalId, status: "approved" })
    .populate({
      path: "student",
      populate: { path: "user", select: "fullName" },
      select: "rollNumber"
    })
    .populate("approvedBy", "fullName");

  if (!request) {
    return res.status(404).json({ valid: false, message: "Invalid document" });
  }

  res.status(200).json({
    valid: true,
    studentName: request.student?.user?.fullName,
    rollNumber: request.student?.rollNumber,
    subject: request.subject,
    status: request.status,
    approvedBy: request.approvedBy?.fullName || "Admin",
    approvalId: request.approvalId,
    approvedAt: request.approvedAt
  });
});
