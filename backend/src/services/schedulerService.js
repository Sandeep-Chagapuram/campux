import cron from "node-cron";
import { sendDailyStudentReports } from "./notificationService.js";

export const startDailyReportScheduler = () => {
  cron.schedule("0 18 * * *", async () => {
    console.log("Running 6 PM daily attendance report job");
    await sendDailyStudentReports();
  });
};
