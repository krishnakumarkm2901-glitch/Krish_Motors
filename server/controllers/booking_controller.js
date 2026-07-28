const Booking = require("../models/booking");
const Service = require("../models/service");
const { hasMissingFields } = require("../utils/helpers");

async function createBooking(request, response) {
  const requiredFields = ["name", "phone", "bikeBrand", "bikeModel", "regNumber", "serviceId", "date"];
  if (hasMissingFields(request.body, requiredFields)) {
    return response.status(400).json({ message: "All booking fields are required." });
  }

  const service = await Service.findOne({ id: request.body.serviceId });
  if (!service) return response.status(404).json({ message: "Selected service was not found." });

  const booking = await Booking.create({
    userId: request.user.id,
    name: request.body.name.trim(),
    phone: request.body.phone.trim(),
    bikeBrand: request.body.bikeBrand.trim(),
    bikeModel: request.body.bikeModel.trim(),
    regNumber: request.body.regNumber.trim(),
    serviceId: service.id,
    serviceName: service.name,
    date: request.body.date,
  });

  return response.status(201).json({ booking });
}

async function listMyBookings(request, response) {
  const bookings = await Booking.find({ userId: request.user.id }).sort({ bookedAt: -1 });
  response.json({ bookings });
}

module.exports = { createBooking, listMyBookings };
