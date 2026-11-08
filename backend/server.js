const http = require("http");
const mongoose = require("mongoose");
const config = require("./config/env");
const connectDB = require("./config/db");
const { app } = require("./app");
const { initWebSocket } = require("./realtime/socketManager");

const server = http.createServer(app);

// Attach WebSocket live broadcast server
initWebSocket(server);

// Handle server-level errors such as port collisions
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\n[TrailGuard] Port ${config.port} is already in use by another process.`
    );
    console.error(
      `Run "lsof -i :${config.port}" and terminate the lingering process to free the port.\n`
    );
  } else {
    console.error("[TrailGuard] Server startup error:", err);
  }
  process.exit(1);
});

// Connect database and launch server
connectDB()
  .then(() => {
    server.listen(config.port, () => {
      console.log(`TrailGuard backend listening on port ${config.port} (${config.env})`);
      console.log(`WebSocket live channel active at /live`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

// Graceful shutdown to release port 3000 and database connections immediately
const gracefulShutdown = (signal) => {
  console.log(`\n[TrailGuard] Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("[TrailGuard] HTTP and WebSocket listeners closed.");
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close(false);
        console.log("[TrailGuard] MongoDB connection closed.");
      }
    } catch (err) {
      console.error("[TrailGuard] Error during database shutdown:", err.message);
    }
    process.exit(0);
  });

  setTimeout(() => {
    console.error("[TrailGuard] Forcefully terminating lingering connections.");
    process.exit(1);
  }, 3000).unref();
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.once("SIGUSR2", () => gracefulShutdown("SIGUSR2"));