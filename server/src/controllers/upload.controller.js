const asyncHandler = require("../middleware/async");
const { uploadToCloudinary } = require("../utils/cloudinary");

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a file",
    });
  }

  try {
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, "prize-images");

    res.status(200).json({
      success: true,
      data: {
        imageUrl: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading image to Cloudinary",
      error: error.message,
    });
  }
});
