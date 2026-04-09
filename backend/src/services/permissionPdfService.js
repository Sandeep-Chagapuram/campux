import puppeteer from "puppeteer";
import QRCode from "qrcode";
import { env } from "../config/env.js";

const fmtDate = (value) => (value ? new Date(value).toLocaleDateString("en-GB") : "-");

const escapeHtml = (value) => {
  if (value == null) return "";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

export const buildPermissionPdf = async ({ request, student, approvedByName, approvedByDesignation }) => {
  const verificationUrl = `${env.serverUrl}/api/verify/${request.approvalId}`;
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, { margin: 1, width: 140 });

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #0f172a; margin: 0; padding: 28px; font-size: 14px; }
          .sheet { border: 1px solid #cbd5e1; padding: 24px; min-height: 1000px; }
          .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 12px; margin-bottom: 24px; }
          .header h1 { margin: 0; color: #1e3a8a; font-size: 24px; }
          .header p { margin: 4px 0; color: #334155; }
          .title { text-align: center; font-size: 18px; font-weight: bold; margin: 12px 0 18px 0; }
          .row { margin: 8px 0; }
          .label { font-weight: bold; display: inline-block; width: 140px; }
          .body { margin-top: 14px; line-height: 1.6; white-space: pre-wrap; border: 1px solid #e2e8f0; padding: 12px; border-radius: 4px; }
          .approval { margin-top: 28px; border-top: 1px dashed #94a3b8; padding-top: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
          .stamp { color: #166534; font-weight: bold; margin-top: 6px; }
          .meta p { margin: 4px 0; }
          .footer-note { margin-top: 22px; color: #475569; font-size: 12px; }
          img { width: 120px; height: 120px; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="header">
            <h1>College Management Institute</h1>
            <p>Official Digital Permission Letter</p>
            <p>Date: ${fmtDate(request.approvedAt)}</p>
          </div>
          <div class="title">Permission Approval Letter</div>
          <div class="row"><span class="label">Student Name:</span> ${escapeHtml(student.user.fullName)}</div>
          <div class="row"><span class="label">Roll Number:</span> ${escapeHtml(student.rollNumber)}</div>
          <div class="row"><span class="label">Subject:</span> ${escapeHtml(request.subject)}</div>
          <div class="row"><span class="label">From Date:</span> ${fmtDate(request.fromDate)}</div>
          <div class="row"><span class="label">To Date:</span> ${fmtDate(request.toDate)}</div>
          <div class="row"><span class="label">Duration:</span> ${escapeHtml(request.durationText || "-")}</div>
          <div class="body">${escapeHtml(request.body)}</div>
          <div class="approval">
            <div class="meta">
              <p><strong>Approved By:</strong> ${escapeHtml(approvedByName)}</p>
              <p><strong>Designation:</strong> ${escapeHtml(approvedByDesignation)}</p>
              <p><strong>Approval ID:</strong> ${escapeHtml(request.approvalId)}</p>
              <p><strong>Approved At:</strong> ${fmtDate(request.approvedAt)}</p>
              <p class="stamp">Status: Digitally Approved</p>
            </div>
            <div>
              <img src="${qrDataUrl}" alt="Verification QR Code" />
            </div>
          </div>
          <p class="footer-note">Scan QR code to verify authenticity at ${escapeHtml(verificationUrl)}</p>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdfUint8 = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    return Buffer.from(pdfUint8);
  } finally {
    await browser.close();
  }
};
