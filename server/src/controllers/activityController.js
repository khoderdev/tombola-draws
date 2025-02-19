const Activity = require("../models/Activity");
const { User } = require("../models");
const { catchAsync } = require("../utils/catchAsync");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

// Create a new activity (internal use only)
const createActivity = async (
  title,
  type,
  description,
  userId = null,
  metadata = {}
) => {
  return await Activity.create({
    title,
    type,
    description,
    userId,
    metadata,
  });
};

// Get recent activities (admin only)
const getRecentActivities = catchAsync(async (req, res) => {
  const { limit = 10, type, startDate, endDate } = req.query;

  const whereClause = {};
  if (type) whereClause.type = type;
  if (startDate || endDate) {
    whereClause.timestamp = {};
    if (startDate) whereClause.timestamp[Op.gte] = new Date(startDate);
    if (endDate) whereClause.timestamp[Op.lte] = new Date(endDate);
  }

  const activities = await Activity.findAll({
    where: whereClause,
    order: [["timestamp", "DESC"]],
    limit: parseInt(limit),
    include: [
      {
        model: User,
        attributes: ["name", "email"],
      },
    ],
  });

  res.json({
    status: "success",
    data: { activities },
  });
});

// Get activity statistics (admin only)
const getActivityStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const whereClause = {};
  const sequelize = req.app.get("sequelize");

  if (startDate || endDate) {
    whereClause.timestamp = {};
    if (startDate) whereClause.timestamp[Op.gte] = new Date(startDate);
    if (endDate) whereClause.timestamp[Op.lte] = new Date(endDate);
  }

  const stats = await Activity.findAll({
    where: whereClause,
    attributes: [
      "type",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"],
    ],
    group: ["type"],
  });

  res.json({
    status: "success",
    data: { stats },
  });
});

module.exports = {
  createActivity,
  getRecentActivities,
  getActivityStats,
};
