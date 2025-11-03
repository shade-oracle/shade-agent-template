import { Hono } from "hono";
import { startNearPriceOracleBot } from "../entrypoint";

const app = new Hono();

// Track background loop state globally
let oracleLoopRunning = false;
let oracleInterval: NodeJS.Timeout | null = null;

async function runOracleLoop() {
  if (oracleLoopRunning) return; // safeguard

  oracleLoopRunning = true;
  console.log("🔁 NEAR Price Oracle loop started.");

  oracleInterval = setInterval(async () => {
    try {
      console.log("🕒 Running startNearPriceOracleBot()...");
      await startNearPriceOracleBot();
      console.log("✅ Oracle run complete.");
    } catch (err) {
      console.error("❌ Oracle loop error:", err);
    }
  }, 30000); // every 5 seconds
}

app.get("/", async (c) => {
  try {
    if (!oracleLoopRunning) {
      runOracleLoop();
      return c.json({ message: "🔁 Oracle loop started successfully." });
    } else {
      return c.json({ message: "⚠️ Oracle loop is already running." });
    }
  } catch (error) {
    console.error("Error starting oracle loop:", error);
    return c.json({ error: "Failed to start oracle loop." }, 500);
  }
});

export default app;
