const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { WebSocketServer } = require('ws');

require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const vitalsRoutes = require('./routes/vitalsRoutes');
const fallRoutes = require('./routes/fallRoutes');
const environmentRoutes = require('./routes/environmentRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'test-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

// WebSocket broadcast function
const clients = new Set();

function broadcast(message) {
  const payload = JSON.stringify(message);

  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vitals', vitalsRoutes(broadcast));
app.use('/api/falls', fallRoutes(broadcast));
app.use('/api/environment', environmentRoutes(broadcast));
app.use('/api/location', locationRoutes(broadcast));

app.get('/', (req, res) => {
  res.json({
    status: 'TrailGuard backend running',
  });
});

module.exports = {app,clients,};
