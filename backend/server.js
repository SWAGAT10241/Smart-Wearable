require("dotenv").config();

const http = require("http");
const { WebSocketServer } = require("ws");
const connectDB = require("./config/db");
const { app, clients } = require("./app");
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({server,path: "/live",});

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log(`Dashboard client connected. Total: ${clients.size}`);
  ws.on("close", () => {
    clients.delete(ws);
    console.log(`Dashboard client disconnected. Total: ${clients.size}`);
  });

  ws.on("error", () => {
    clients.delete(ws);
  });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`TrailGuard backend listening on port ${PORT}`);
      console.log(`WebSocket live channel at /live`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:",error);
    process.exit(1);
  });