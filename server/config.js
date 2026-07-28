const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const config = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI?.trim(),
  jwtSecret: process.env.JWT_SECRET || "change-this-development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN,
  admin: {
    name: process.env.ADMIN_NAME || "Krish_Motors Admin",
    email: (process.env.ADMIN_EMAIL || "admin@krishmotors.com").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "Admin@123",
  },
};

function validateEnvironment() {
  if (!config.mongodbUri) {
    throw new Error(
      "MONGODB_URI is required. Add it to server/.env for local development " +
      "or to the Render environment variables before deployment."
    );
  }
}

module.exports = { ...config, config, validateEnvironment };
