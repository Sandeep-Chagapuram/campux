import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { ensureDefaultAdmin } from "./services/bootstrapService.js";
import { startDailyReportScheduler } from "./services/schedulerService.js";
import { initializeWhatsAppClient } from "./services/whatsappService.js";

const startServer = async () => {
  await connectDB();
  await ensureDefaultAdmin();
  initializeWhatsAppClient();
  startDailyReportScheduler();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
