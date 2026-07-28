const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Unread", "Read", "Replied"], default: "Unread" },
  },
  { timestamps: { createdAt: "sentAt", updatedAt: "updatedAt" } }
);

contactSchema.set("toJSON", {
  transform: (_document, value) => {
    value.id = value._id.toString();
    delete value._id;
    delete value.__v;
    return value;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
