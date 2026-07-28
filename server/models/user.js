const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: { createdAt: "registeredAt", updatedAt: "updatedAt" } }
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    registeredAt: this.registeredAt,
    lastLogin: this.lastLogin,
  };
};

module.exports = mongoose.model("User", userSchema);
