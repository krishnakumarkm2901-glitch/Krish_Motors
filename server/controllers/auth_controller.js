const bcrypt = require("bcryptjs");

const config = require("../config");
const User = require("../models/user");
const { createToken } = require("../middleware/auth");
const { hasMissingFields } = require("../utils/helpers");

async function register(request, response) {
  const { name, email, phone, password } = request.body;

  if (hasMissingFields(request.body, ["name", "email", "phone", "password"]) || password.length < 6) {
    return response.status(400).json({
      message: "Name, email, phone, and a 6-character password are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return response.status(409).json({ message: "An account with this email already exists." });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash: await bcrypt.hash(password, 12),
    role: "user",
    lastLogin: new Date(),
  });

  return response.status(201).json({
    token: createToken(user),
    user: user.toPublicJSON(),
  });
}

async function login(request, response) {
  const email = String(request.body.email || "").trim().toLowerCase();
  const password = String(request.body.password || "");
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return response.status(401).json({ message: "Incorrect email or password." });
  }

  if (request.body.role && user.role !== request.body.role) {
    return response.status(401).json({ message: "Incorrect email or password." });
  }

  user.lastLogin = new Date();
  await user.save();

  return response.json({
    token: createToken(user),
    user: user.toPublicJSON(),
  });
}

function currentUser(request, response) {
  response.json({ user: request.user.toPublicJSON() });
}

async function ensureAdmin() {
  const passwordHash = await bcrypt.hash(config.admin.password, 12);
  await User.findOneAndUpdate(
    { email: config.admin.email },
    {
      name: config.admin.name,
      email: config.admin.email,
      phone: "",
      passwordHash,
      role: "admin",
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

module.exports = { register, login, currentUser, ensureAdmin };
