import "dotenv/config";
import { sequelize } from "../models/index.js";

async function syncDatabase() {
  try {
    console.log("🔄 Connecting and syncing MySQL database with Sequelize...");
    await sequelize.authenticate();
    console.log("✓ Database connection authenticated successfully.");

    // Sync all models to create/alter tables
    await sequelize.sync({ alter: true });
    console.log("✅ All MySQL tables synchronized successfully!");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
