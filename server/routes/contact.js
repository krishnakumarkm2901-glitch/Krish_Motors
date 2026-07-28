const express = require("express");

const contactController = require("../controllers/contact_controller");
const { optionalAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();

router.post("/", optionalAuth, asyncHandler(contactController.createContact));

module.exports = router;
