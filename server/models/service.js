const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

serviceSchema.set("toJSON", {
  transform: (_document, value) => {
    delete value._id;
    delete value.__v;
    delete value.createdAt;
    delete value.updatedAt;
    return value;
  },
});

module.exports = mongoose.model("Service", serviceSchema);
