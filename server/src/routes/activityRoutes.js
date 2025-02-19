const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getRecentActivities,
  getActivityStats,
} = require("../controllers/activityController");

// Protect all routes and restrict to admin only
router.use(protect);
router.use(authorize("admin"));

router.get("/recent", getRecentActivities);
router.get("/stats", getActivityStats);

module.exports = router;
