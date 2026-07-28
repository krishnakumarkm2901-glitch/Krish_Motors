const express = require("express");

const serviceController = require("../controllers/service_controller");
const { requireAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();

router.get("/", asyncHandler(serviceController.listServices));
router.post("/", requireAuth("admin"), asyncHandler(serviceController.createService));
router.put("/:identifier", requireAuth("admin"), asyncHandler(serviceController.updateService));
router.delete("/:identifier", requireAuth("admin"), asyncHandler(serviceController.deleteService));

module.exports = router;
