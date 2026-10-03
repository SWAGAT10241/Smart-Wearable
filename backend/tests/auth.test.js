process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();
const mockUserFindById = jest.fn();
const mockUserFindByIdAndUpdate = jest.fn();
jest.mock("../models/User", () => ({
  findOne: mockUserFindOne,
  create: mockUserCreate,
  findById: mockUserFindById,
  findByIdAndUpdate: mockUserFindByIdAndUpdate,
}));
const { app } = require("../app");
describe("TrailGuard Authentication API", () => {
  const userId = "507f1f77bcf86cd799439011";
  const validUserData = {
    username: "Test User",
    password: "TestPassword123!",
    email: "test@example.com",
    phoneNumber: "9876543210",
    emergencyContactName: "Emergency Contact",
    emergencyContactPhone: "9123456789",
    height: 175,
    weight: 70,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // ─────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────
  describe("POST /api/auth/register", () => {
    test("registers a new user successfully", async () => {
      mockUserFindOne.mockResolvedValue(null);
      mockUserCreate.mockResolvedValue({
        _id: userId,
        username: validUserData.username,
        email: validUserData.email,
        profileComplete: true,
      });
      const response = await request(app)
        .post("/api/auth/register")
        .send(validUserData);
      expect(response.statusCode).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toEqual({
        id: userId,
        username: "Test User",
        email: "test@example.com",
        profileComplete: true,
      });
      expect(mockUserFindOne).toHaveBeenCalledWith({
        email: validUserData.email,
      });
      expect(mockUserCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          username: validUserData.username,
          email: validUserData.email,
          phoneNumber: validUserData.phoneNumber,
          emergencyContactName: validUserData.emergencyContactName,
          emergencyContactPhone: validUserData.emergencyContactPhone,
          height: validUserData.height,
          weight: validUserData.weight,
          authProvider: "local",
          profileComplete: true,
        }),
      );
    });
    test("rejects registration when required fields are missing", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "Test User",
        email: "test@example.com",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        "All fields are required, including emergency contact details",
      );
      expect(mockUserCreate).not.toHaveBeenCalled();
    });
    test("rejects duplicate email registration", async () => {
      mockUserFindOne.mockResolvedValue({
        _id: userId,
        email: validUserData.email,
      });
      const response = await request(app)
        .post("/api/auth/register")
        .send(validUserData);
      expect(response.statusCode).toBe(409);
      expect(response.body.error).toBe("Email already registered");
      expect(mockUserCreate).not.toHaveBeenCalled();
    });
  });
  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  describe("POST /api/auth/login", () => {
    test("logs in successfully with valid credentials", async () => {
      const comparePassword = jest.fn().mockResolvedValue(true);
      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: userId,
          username: "Test User",
          email: "test@example.com",
          password: "hashed-password",
          profileComplete: true,
          comparePassword,
        }),
      });
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "TestPassword123!",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toEqual({
        id: userId,
        username: "Test User",
        email: "test@example.com",
        profileComplete: true,
      });
      expect(comparePassword).toHaveBeenCalledWith("TestPassword123!");
    });
    test("rejects login with wrong password", async () => {
      const comparePassword = jest.fn().mockResolvedValue(false);
      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: userId,
          username: "Test User",
          email: "test@example.com",
          password: "hashed-password",
          profileComplete: true,
          comparePassword,
        }),
      });
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "WrongPassword!",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("Invalid email or password");
      expect(response.body.token).toBeUndefined();
    });
    test("rejects login for unknown email", async () => {
      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
      const response = await request(app).post("/api/auth/login").send({
        email: "unknown@example.com",
        password: "TestPassword123!",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("Invalid email or password");
    });
    test("does not issue a token when the user has no password", async () => {
      mockUserFindOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: userId,
          username: "Google User",
          email: "google@example.com",
          password: null,
          profileComplete: false,
        }),
      });
      const response = await request(app).post("/api/auth/login").send({
        email: "google@example.com",
        password: "anything",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("Invalid email or password");
    });
  });
  // ─────────────────────────────────────────────
  // JWT / /ME
  // ─────────────────────────────────────────────
  describe("GET /api/auth/me", () => {
    test("returns the authenticated user with a valid JWT", async () => {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      mockUserFindById.mockResolvedValue({
        _id: userId,
        username: "Test User",
        email: "test@example.com",
        profileComplete: true,
      });
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.user).toEqual(
        expect.objectContaining({
          _id: userId,
          username: "Test User",
          email: "test@example.com",
        }),
      );
      expect(mockUserFindById).toHaveBeenCalledWith(userId);
    });
    test("rejects request without Authorization header", async () => {
      const response = await request(app).get("/api/auth/me");
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("No token provided");
      expect(mockUserFindById).not.toHaveBeenCalled();
    });
    test("rejects an invalid JWT", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("Invalid or expired token");
      expect(mockUserFindById).not.toHaveBeenCalled();
    });
    test("rejects an expired JWT", async () => {
      const expiredToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "-1s",
      });
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`);
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("Invalid or expired token");
      expect(mockUserFindById).not.toHaveBeenCalled();
    });
    test("returns 404 when JWT is valid but user does not exist", async () => {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      mockUserFindById.mockResolvedValue(null);
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });
  // ─────────────────────────────────────────────
  // COMPLETE PROFILE
  // ─────────────────────────────────────────────
  describe("PATCH /api/auth/complete-profile", () => {
    test("requires authentication", async () => {
      const response = await request(app)
        .patch("/api/auth/complete-profile")
        .send({
          phoneNumber: "9876543210",
          emergencyContactName: "Emergency Contact",
          emergencyContactPhone: "9123456789",
          height: 175,
          weight: 70,
        });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("No token provided");
    });
    test("rejects incomplete profile data", async () => {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const response = await request(app)
        .patch("/api/auth/complete-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          phoneNumber: "9876543210",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        "All fields are required, including emergency contact details",
      );
      expect(mockUserFindByIdAndUpdate).not.toHaveBeenCalled();
    });
    test("completes profile successfully", async () => {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      mockUserFindByIdAndUpdate.mockResolvedValue({
        _id: userId,
        username: "Test User",
        email: "test@example.com",
        phoneNumber: "9876543210",
        emergencyContactName: "Emergency Contact",
        emergencyContactPhone: "9123456789",
        height: 175,
        weight: 70,
        profileComplete: true,
      });
      const response = await request(app)
        .patch("/api/auth/complete-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          phoneNumber: "9876543210",
          emergencyContactName: "Emergency Contact",
          emergencyContactPhone: "9123456789",
          height: 175,
          weight: 70,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Profile completed successfully");
      expect(response.body.user.profileComplete).toBe(true);
      expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          phoneNumber: "9876543210",
          emergencyContactName: "Emergency Contact",
          emergencyContactPhone: "9123456789",
          height: 175,
          weight: 70,
          profileComplete: true,
        }),
        {
          new: true,
          runValidators: true,
        },
      );
    });
    test("returns 404 when authenticated user does not exist", async () => {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      mockUserFindByIdAndUpdate.mockResolvedValue(null);
      const response = await request(app)
        .patch("/api/auth/complete-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          phoneNumber: "9876543210",
          emergencyContactName: "Emergency Contact",
          emergencyContactPhone: "9123456789",
          height: 175,
          weight: 70,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });
});
