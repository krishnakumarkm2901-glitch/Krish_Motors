const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

module.exports = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/bike_service_booking",
  jwtSecret: process.env.JWT_SECRET || "change-this-development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  admin: {
    name: process.env.ADMIN_NAME || "Krish_Motors Admin",
    email: (process.env.ADMIN_EMAIL || "admin@krishmotors.com").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "Admin@123",
  },
};
