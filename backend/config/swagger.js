/**
 * TrailGuard / SWAAS — OpenAPI 3.0 Specification & Swagger UI Setup
 */
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "TrailGuard / SWAAS API Documentation",
    version: "2.0.0",
    description:
      "Safety-critical smart wearable IoT ecosystem for hikers and lone workers. Features biometric telemetry, edge fall detection, Ed25519 device authentication, and ephemeral emergency dispatch.",
    contact: {
      name: "TrailGuard Engineering Team",
      url: "https://github.com/SWAGAT10241/Smart-Wearable",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Development Server",
    },
  ],
  tags: [
    { name: "System", description: "Liveness and readiness health checks" },
    { name: "Auth", description: "User registration, authentication & OAuth" },
    { name: "Emergency", description: "Emergency sessions, tickets & rescue coordination" },
    { name: "Devices", description: "Hardware provisioning, pairing & Ed25519 ingest" },
    { name: "Telemetry", description: "Real-time vitals, fall alerts, and GPS location" },
  ],
  paths: {
    "/livez": {
      get: {
        tags: ["System"],
        summary: "Process liveness probe",
        responses: {
          200: { description: "Process is live", content: { "application/json": { example: { status: "live" } } } },
        },
      },
    },
    "/readyz": {
      get: {
        tags: ["System"],
        summary: "Readiness probe (verifies MongoDB)",
        responses: {
          200: { description: "Database is ready", content: { "application/json": { example: { status: "ready", dependencies: { mongodb: "ready" } } } } },
          503: { description: "Database is unavailable" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user account with emergency contacts",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password", "phoneNumber", "emergencyContactName", "emergencyContactPhone"],
                properties: {
                  username: { type: "string", example: "John Doe" },
                  email: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", minLength: 8, example: "Secret123!" },
                  phoneNumber: { type: "string", example: "+15550199001" },
                  emergencyContactName: { type: "string", example: "Jane Doe" },
                  emergencyContactPhone: { type: "string", example: "+15550199002" },
                  height: { type: "number", example: 178 },
                  weight: { type: "number", example: 74 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error or user already exists" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate user and obtain JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "john@example.com" },
                  password: { type: "string", example: "Secret123!" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful; returns JWT token and user profile" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/emergency/ws-ticket": {
      post: {
        tags: ["Emergency"],
        summary: "Obtain a single-use 60-second WebSocket authentication ticket",
        security: [{ BearerAuth: [] }],
        responses: {
          201: {
            description: "Ticket generated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ticket: { type: "string", example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" },
                    expiresInSeconds: { type: "number", example: 60 },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/emergency/sessions": {
      post: {
        tags: ["Emergency"],
        summary: "Initiate an active emergency session",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["deviceId", "triggerType"],
                properties: {
                  deviceId: { type: "string", example: "TG-DEMO-001" },
                  triggerType: { type: "string", enum: ["SOS_BUTTON", "FALL_DETECTED", "MANUAL"], example: "SOS_BUTTON" },
                  initialLocation: {
                    type: "object",
                    properties: {
                      latitude: { type: "number", example: 37.7749 },
                      longitude: { type: "number", example: -122.4194 },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Emergency session created" },
          403: { description: "Device not owned by user" },
        },
      },
    },
    "/api/emergency/sessions/active": {
      get: {
        tags: ["Emergency"],
        summary: "List all currently active emergency sessions (Scoped by Role)",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Active emergency sessions list" },
        },
      },
    },
    "/api/emergency/sessions/{sessionId}/historical": {
      get: {
        tags: ["Emergency"],
        summary: "Historical telemetry replay capped at 6 hours (Audit Log Enforced)",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "sessionId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Historical readings (capped at 100 samples per sensor)" },
          500: { description: "AUDIT_FAILURE (Fail-closed security lock triggered)" },
        },
      },
    },
    "/api/devices/register": {
      post: {
        tags: ["Devices"],
        summary: "Provision a new wearable hardware device",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["deviceId", "publicKey"],
                properties: {
                  deviceId: { type: "string", example: "TG-DEMO-001" },
                  deviceName: { type: "string", example: "Alpine Wearable" },
                  publicKey: { type: "string", description: "Base64 Ed25519 public key" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Device provisioned" },
        },
      },
    },
    "/api/device/readings": {
      post: {
        tags: ["Devices"],
        summary: "Hardware telemetry ingestion (Requires Ed25519 Asymmetric Signature)",
        parameters: [
          { name: "X-Device-ID", in: "header", required: true, schema: { type: "string" } },
          { name: "X-Device-Timestamp", in: "header", required: true, schema: { type: "string" } },
          { name: "X-Device-Nonce", in: "header", required: true, schema: { type: "string" } },
          { name: "X-Device-Signature", in: "header", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  heartRate: { type: "number", example: 78 },
                  spo2: { type: "number", example: 98 },
                  latitude: { type: "number", example: 37.7749 },
                  longitude: { type: "number", example: -122.4194 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Reading ingested and broadcasted to device owner" },
          401: { description: "Invalid Ed25519 signature, timestamp skew, or replayed nonce" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Standard JSON Web Token passed in Authorization header: Bearer <token>",
      },
    },
  },
};

/**
 * Attaches Swagger UI and raw OpenAPI JSON endpoints to the Express app.
 *
 * @param {import('express').Application} app
 */
function setupSwagger(app) {
  // Raw OpenAPI specification endpoint
  app.get("/api/docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Interactive Swagger UI Dashboard
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "TrailGuard / SWAAS API Docs",
      customCss: ".swagger-ui .topbar { display: none }",
    }),
  );
}

module.exports = {
  setupSwagger,
  swaggerSpec,
};
