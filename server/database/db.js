const mongoose = require("mongoose");

async function connectDatabase(mongodbUri) {
  if (!mongodbUri) {
    throw new Error("Cannot connect to MongoDB: MONGODB_URI is missing.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongodbUri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };
