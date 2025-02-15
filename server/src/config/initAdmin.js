const { User } = require("../models");
const bcrypt = require("bcryptjs");

async function initializeAdmin() {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({
      where: { email: "admin@tombola.com" },
    });

    if (!adminExists) {
      // Create admin user
      const admin = await User.create({
        name: "Admin",
        email: "admin@tombola.com",
        password: "admin123",
        role: "admin",
        isVerified: true,
      });

      console.log("Admin user created successfully:", admin.email);
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

module.exports = initializeAdmin;
