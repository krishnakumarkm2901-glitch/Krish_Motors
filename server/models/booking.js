const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    bikeBrand: { type: String, required: true, trim: true },
    bikeModel: { type: String, required: true, trim: true },
    regNumber: { type: String, required: true, trim: true, uppercase: true },
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Confirmed", "In Service", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: { createdAt: "bookedAt", updatedAt: "updatedAt" } }
);

bookingSchema.set("toJSON", {
  transform: (_document, value) => {
    value.id = value._id.toString();
    delete value._id;
    delete value.__v;
    return value;
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
