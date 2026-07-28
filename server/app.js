const express = require("express");
const cors = require("cors");

const { config, validateEnvironment } = require("./config");
const { connectDatabase } = require("./database/db");
const { ensureAdmin } = require("./controllers/auth_controller");
const { seedServices } = require("./controllers/service_controller");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/booking");
const serviceRoutes = require("./routes/services");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");

function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json({ limit: "3mb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/contact", contactRoutes);

  app.use((_request, response) => {
    response.status(404).json({ message: "Endpoint not found." });
  });

  app.use((error, _request, response, _next) => {
    console.error(error);

    if (error.name === "ValidationError") {
      return response.status(400).json({ message: "Please check the submitted information." });
    }
    if (error.code === 11000) {
      return response.status(409).json({ message: "That record already exists." });
    }

    return response.status(500).json({ message: "Something went wrong on the server." });
  });

  return app;
}

async function startServer() {
  validateEnvironment();
  await connectDatabase(config.mongodbUri);
  await seedServices();
  await ensureAdmin();

  const app = createApp();
  return app.listen(config.port, () => {
    console.log(`API running on port ${config.port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    if (/bad auth|authentication failed/i.test(error.message)) {
      console.error(
        "Unable to start the API: MongoDB Atlas rejected MONGODB_URI. " +
        "Check the Atlas database username and password in Render. " +
        "Do not include < or > around the password."
      );
    } else {
      console.error("Unable to start the API:", error.message);
    }
    process.exit(1);
  });
}

module.exports = { createApp, startServer };
