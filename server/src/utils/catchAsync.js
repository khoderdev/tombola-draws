const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error("Error caught by catchAsync:", err);
      res.status(500).json({
        status: "error",
        message: err.message || "Internal server error",
      });
    });
  };
};

module.exports = { catchAsync };
