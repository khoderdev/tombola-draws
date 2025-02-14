const express = require('express');
const multer = require('multer');
const path = require('path');
const profileController = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  },
});

// Protect all routes
router.use(protect);

// Get profile
router.get('/profile', profileController.getProfile);

// Update profile
router.put('/profile', profileController.updateProfile);

// Change password
router.post('/profile/change-password', profileController.changePassword);

// Upload avatar
router.post('/profile/avatar', upload.single('avatar'), profileController.uploadAvatar);

// Get profile stats
router.get('/profile/stats', profileController.getStats);

module.exports = router;
