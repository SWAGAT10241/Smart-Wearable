const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');
const { WebSocketServer } = require('ws');

require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const vitalsRoutes = require('./routes/vitalsRoutes');
const fallRoutes = require('./routes/fallRoutes');
const environmentRoutes = require('./routes/environmentRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {app.set('trust proxy', 1);}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

// Session configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'test-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  },
};

// Use MongoDB sessions when MONGODB_URI is available.
// This is used in local development and production.
if (process.env.MONGODB_URI) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60,
  });
}

app.use(session(sessionOptions));
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

module.exports = { app, clients };