const { User, Draw, Ticket } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");
const { uploadToCloudinary } = require("../utils/cloudinary");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { 
        exclude: ["password"],
        include: ["avatar"]  // Explicitly include avatar
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching profile",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Email already in use",
        });
      }
    }

    // Update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      address: address || user.address,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating profile",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({ password: hashedPassword });

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      status: "error",
      message: "Error changing password",
    });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Upload to cloudinary
    const result = await uploadToCloudinary(req.file.path, "avatars");

    // Update user avatar
    await user.update({ avatar: result.secure_url });

    res.status(200).json({
      status: "success",
      data: {
        avatar: result.secure_url,
      },
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({
      status: "error",
      message: "Error uploading avatar",
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total tickets
    const totalTickets = await Ticket.count({
      where: { userId },
    });

    // Get active tickets
    const activeTickets = await Ticket.count({
      where: { userId, status: "active" },
    });

    // Get won tickets
    const wonTickets = await Ticket.count({
      where: { userId, status: "won" },
    });

    // Get total spent by summing up draw prices
    const totalSpent = await Ticket.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Ticket.id')), 'ticketCount'],
        [sequelize.col('Draw.price'), 'drawPrice']
      ],
      where: { userId },
      include: [{ 
        model: Draw,
        as: 'Draw',
        attributes: []
      }],
      group: ['Draw.price'],
      raw: true
    }).then(results => 
      results.reduce((sum, row) => 
        sum + (parseFloat(row.drawPrice) * parseInt(row.ticketCount)), 0)
    );

    // Get upcoming draws with tickets
    const upcomingDraws = await Draw.findAll({
      include: [
        {
          model: Ticket,
          as: 'tickets',
          where: { userId, status: "active" },
          required: true,
        },
      ],
      where: {
        endDate: {
          [Op.gt]: new Date(),
        },
        status: "active",
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalTickets,
          activeTickets,
          wonTickets,
          totalSpent: totalSpent || 0,
          upcomingDraws: upcomingDraws.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching stats",
    });
  }
};
