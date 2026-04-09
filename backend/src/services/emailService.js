import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  secure: env.email.port === 465,
  auth: env.email.user && env.email.pass ? { user: env.email.user, pass: env.email.pass } : undefined
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!env.email.user || !env.email.pass) {
    console.warn("Email skipped: EMAIL_USER or EMAIL_PASS missing");
    return;
  }
  await transporter.sendMail({
    from: env.email.from,
    to,
    subject,
    html
  });
};
