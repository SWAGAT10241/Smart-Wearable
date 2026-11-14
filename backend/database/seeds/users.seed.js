/**
 * TrailGuard — User Seeding Script
 * Creates baseline test accounts with pre-hashed credentials.
 */
const User = require("../../models/User");

const SEED_USERS = [
  {
    username: "Commander Dave",
    email: "admin@trailguard.local",
    password: "Password123!",
    phoneNumber: "+15550199001",
    emergencyContactName: "Sarah Connor",
    emergencyContactPhone: "+15550199002",
    height: 180,
    weight: 75,
    profileComplete: true,
  },
  {
    username: "Responder Alice",
    email: "responder@trailguard.local",
    password: "Password123!",
    phoneNumber: "+15550199003",
    emergencyContactName: "Dispatch HQ",
    emergencyContactPhone: "+15550199000",
    height: 165,
    weight: 60,
    profileComplete: true,
  },
  {
    username: "Hiker Bob",
    email: "citizen@trailguard.local",
    password: "Password123!",
    phoneNumber: "+15550199005",
    emergencyContactName: "Alice Bob",
    emergencyContactPhone: "+15550199003",
    height: 175,
    weight: 70,
    profileComplete: true,
  },
];

async function seedUsers() {
  const seeded = [];
  for (const userData of SEED_USERS) {
    const existing = await User.findOne({ email: userData.email });
    if (!existing) {
      const user = await User.create(userData);
      seeded.push(user.email);
    }
  }
  return seeded;
}

module.exports = { seedUsers, SEED_USERS };
