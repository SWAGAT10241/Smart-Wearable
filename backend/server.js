const http = require("http");
const config = require("./config/env");
const connectDB = require("./config/db");
const { app } = require("./app");
const { initWebSocket } = require("./realtime/socketManager");
const logger = require("./utils/logger");

const server = http.createServer(app);

// Attach WebSocket live broadcast server
initWebSocket(server);

// Connect database and launch server
connectDB()
  .then(() => {
    server.listen(config.port, () => {
      logger.info("server.started", { port: config.port });
      logger.info("websocket.server_started", { route: "/live" });
    });
  })
  .catch((error) => {
    logger.error("server.database_startup_failed", { error });
    process.exit(1);
  });