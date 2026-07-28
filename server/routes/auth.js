const express = require("express");

const authController = require("../controllers/auth_controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.get("/me", requireAuth(), authController.currentUser);

module.exports = router;
