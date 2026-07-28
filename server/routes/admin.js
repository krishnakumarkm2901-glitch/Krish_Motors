const express = require("express");

const adminController = require("../controllers/admin_controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();

router.use(requireAuth("admin"));
router.get("/bookings", asyncHandler(adminController.listBookings));
router.patch("/bookings/:identifier", asyncHandler(adminController.updateBooking));
router.get("/users", asyncHandler(adminController.listUsers));
router.get("/contacts", asyncHandler(adminController.listContacts));
router.patch("/contacts/:identifier", asyncHandler(adminController.updateContact));
router.delete("/contacts/:identifier", asyncHandler(adminController.deleteContact));

module.exports = router;
