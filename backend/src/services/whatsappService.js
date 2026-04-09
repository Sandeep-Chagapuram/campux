import qrcode from "qrcode-terminal";
import whatsappPkg from "whatsapp-web.js";
import { env } from "../config/env.js";

const { Client, LocalAuth } = whatsappPkg;

let whatsappClient = null;
let isClientReady = false;

export const initializeWhatsAppClient = () => {
  if (!env.whatsappEnabled) return;
  if (whatsappClient) return;

  whatsappClient = new Client({
    authStrategy: new LocalAuth()
  });

  whatsappClient.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Scan WhatsApp QR code in terminal");
  });

  whatsappClient.on("ready", () => {
    isClientReady = true;
    console.log("WhatsApp client is ready");
  });

  whatsappClient.on("auth_failure", (message) => {
    console.error("WhatsApp auth failure", message);
  });

  whatsappClient.initialize().catch((error) => {
    console.error("WhatsApp client failed to initialize", error);
  });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendWhatsAppWithDelay = async (phoneNumber, message) => {
  if (!env.whatsappEnabled || !whatsappClient || !isClientReady || !phoneNumber) return;
  const chatId = `${phoneNumber.replace(/\D/g, "")}@c.us`;
  await delay(env.whatsappDelayMs);
  await whatsappClient.sendMessage(chatId, message);
};
