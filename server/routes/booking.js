const express = require("express");

const bookingController = require("../controllers/booking_controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();

router.get("/", requireAuth("user"), asyncHandler(bookingController.listMyBookings));
router.post("/", requireAuth("user"), asyncHandler(bookingController.createBooking));

module.exports = router;
