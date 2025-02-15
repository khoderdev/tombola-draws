require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./config/database");
const initializeAdmin = require("./config/initAdmin");

// Import routes
const authRoutes = require("./routes/auth.routes");
const drawRoutes = require("./routes/draw.routes");
const ticketRoutes = require("./routes/ticket.routes");
const profileRoutes = require("./routes/profile.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Tombola Server!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/draws", drawRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 3000;

// Sync database and start server
sequelize
  .sync({ alter: process.env.NODE_ENV === "development" })
  .then(async () => {
    // Initialize admin user
    await initializeAdmin();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
