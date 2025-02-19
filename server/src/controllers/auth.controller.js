const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../models");
const { sendEmail } = require("../utils/email");
const activityTracker = require("../utils/activityTracker");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already registered",
      });
    }

    const verificationToken = uuidv4();
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      verificationToken,
    });

    // Track user registration
    await activityTracker.trackUserActivity(
      "User Registration",
      `New user registered: ${name}`,
      user.id,
      { email }
    );

    // Send verification email
    try {
      const verificationUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/auth/verify-email/${verificationToken}`;

      await sendEmail({
        email: user.email,
        subject: "Email Verification",
        text: `Please verify your email by clicking on this link: ${verificationUrl}`,
        html: `
          <h1>Welcome to Tombola Draws!</h1>
          <p>Please verify your email by clicking on the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
        `,
      });
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Continue with registration even if email fails
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Error registering user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Track successful login
    await activityTracker.trackUserActivity(
      "User Login",
      `User logged in: ${user.name}`,
      user.id
    );

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

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
          isVerified: user.isVerified,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Error logging in",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      status: "error",
      message: "Error verifying email",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const resetToken = uuidv4();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset",
        text: `You requested a password reset. Please click on this link to reset your password: ${resetUrl}`,
      });
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      // Continue with password reset even if email fails
    }

    res.status(200).json({
      status: "success",
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      status: "error",
      message: "Error sending password reset email",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired reset token",
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      status: "error",
      message: "Error resetting password",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid refresh token",
      });
    }

    const token = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      status: "success",
      data: {
        token,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      status: "error",
      message: "Invalid refresh token",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
