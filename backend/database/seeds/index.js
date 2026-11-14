/**
 * TrailGuard — Master Seed Runner
 * Connects to MongoDB, seeds initial dataset, and disconnects gracefully.
 */
const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const { seedUsers } = require("./users.seed");
const { seedDevices } = require("./devices.seed");

async function runSeeds() {
  console.log("\n[Seed] Connecting to MongoDB...");
  await connectDB();

  try {
    console.log("[Seed] Seeding users...");
    const users = await seedUsers();
    console.log(`[Seed] Seeded ${users.length} new users.`);

    console.log("[Seed] Seeding devices...");
    const devices = await seedDevices();
    console.log(`[Seed] Seeded ${devices.length} new devices.`);

    console.log("[Seed] Database seeding completed successfully.\n");
  } catch (error) {
    console.error("[Seed] Error during seeding:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("[Seed] Database connection closed.");
  }
}

if (require.main === module) {
  runSeeds();
}

module.exports = { runSeeds };
