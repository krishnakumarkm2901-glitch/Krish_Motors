const mongoose = require("mongoose");

const Booking = require("../models/booking");
const Contact = require("../models/contact");
const User = require("../models/user");

const bookingStatuses = [
  "Pending", "Contacted", "Confirmed", "In Service", "Delivered", "Cancelled",
];
const messageStatuses = ["Unread", "Read", "Replied"];

function isValidId(identifier) {
  return mongoose.isObjectIdOrHexString(identifier);
}

async function listBookings(_request, response) {
  const bookings = await Booking.find().sort({ bookedAt: -1 });
  response.json({ bookings });
}

async function updateBooking(request, response) {
  if (!bookingStatuses.includes(request.body.status)) {
    return response.status(400).json({ message: "Invalid booking status." });
  }
  if (!isValidId(request.params.identifier)) {
    return response.status(404).json({ message: "Booking not found." });
  }

  const booking = await Booking.findByIdAndUpdate(
    request.params.identifier,
    { status: request.body.status },
    { new: true, runValidators: true }
  );
  if (!booking) return response.status(404).json({ message: "Booking not found." });
  return response.json({ status: booking.status });
}

async function listUsers(_request, response) {
  const records = await User.find({ role: "user" }).sort({ registeredAt: -1 });
  response.json({ users: records.map((user) => user.toPublicJSON()) });
}

async function listContacts(_request, response) {
  const messages = await Contact.find().sort({ sentAt: -1 });
  response.json({ messages });
}

async function updateContact(request, response) {
  if (!messageStatuses.includes(request.body.status)) {
    return response.status(400).json({ message: "Invalid message status." });
  }
  if (!isValidId(request.params.identifier)) {
    return response.status(404).json({ message: "Message not found." });
  }

  const message = await Contact.findByIdAndUpdate(
    request.params.identifier,
    { status: request.body.status },
    { new: true, runValidators: true }
  );
  if (!message) return response.status(404).json({ message: "Message not found." });
  return response.json({ status: message.status });
}

async function deleteContact(request, response) {
  if (!isValidId(request.params.identifier)) {
    return response.status(404).json({ message: "Message not found." });
  }
  const message = await Contact.findByIdAndDelete(request.params.identifier);
  if (!message) return response.status(404).json({ message: "Message not found." });
  return response.status(204).send();
}

module.exports = {
  listBookings,
  updateBooking,
  listUsers,
  listContacts,
  updateContact,
  deleteContact,
};
