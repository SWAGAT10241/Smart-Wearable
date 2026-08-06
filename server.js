require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { WebSocketServer } = require('ws');

const connectDB = require('./config/db');
require('./config/passport'); // registers the Google strategy

const authRoutes = require('./routes/authRoutes');
const vitalsRoutes = require('./routes/vitalsRoutes');
const fallRoutes = require('./routes/fallRoutes');
const environmentRoutes = require('./routes/environmentRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const server = http.createServer(app);

// ---- Middleware ----
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

// ---- WebSocket setup ----
// Every connected dashboard client gets pushed live sensor data the instant
// the ESP32 posts it, instead of the frontend having to poll the API
const wss = new WebSocketServer({ server, path: '/live' });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Dashboard client connected. Total:', clients.size);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

function broadcast(message) {
  const payload = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
}

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/vitals', vitalsRoutes(broadcast));
app.use('/api/falls', fallRoutes(broadcast));
app.use('/api/environment', environmentRoutes(broadcast));
app.use('/api/location', locationRoutes(broadcast));

app.get('/', (req, res) => {
  res.json({ status: 'TrailGuard backend running' });
});

// ---- Start server ----
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`TrailGuard backend listening on port ${PORT}`);
    console.log(`WebSocket live channel at ws://localhost:${PORT}/live`);
  });
});
