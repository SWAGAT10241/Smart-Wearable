const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Only required for local (non-Google) accounts — enforced in pre-save hook below
    password: {
      type: String,
      select: false, // never return password in queries by default
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.authProvider === "local" || this.profileComplete === true;
      },
    },
    // Emergency contact — REQUIRED, not optional. This is the number TrailGuard
    // sends SOS alerts to when a fall is detected or the SOS button is pressed.
    emergencyContactPhone: {
      type: String,
      required: function () {
        return this.authProvider === "local" || this.profileComplete === true;
      },
    },
    emergencyContactName: {
      type: String,
      required: function () {
        return this.authProvider === "local" || this.profileComplete === true;
      },
    },
    height: {
      type: Number,
      required: function () {
        return this.authProvider === "local" || this.profileComplete === true;
      },
    },
    weight: {
      type: Number,
      required: function () {
        return this.authProvider === "local" || this.profileComplete === true;
      },
    },
    // True once phone/emergency contact/height/weight are filled in
    // (needed because Google signup only provides name + email)
    profileComplete: {
      type: Boolean,
      default: false,
    },
    deviceId: {
      type: String, // links this user to their physical ESP32 wearable
      default: null,
    },
  },
  { timestamps: true },
);

// Hash password before saving, only for local accounts with a password set
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);