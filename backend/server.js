const http = require("http");
const config = require("./config/env");
const connectDB = require("./config/db");
const { app } = require("./app");
const { initWebSocket } = require("./realtime/socketManager");

const server = http.createServer(app);

// Attach WebSocket live broadcast server
initWebSocket(server);

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