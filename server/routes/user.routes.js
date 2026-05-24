const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

const {
  updateProfile,
} = require('../controllers/user.controller');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// All user routes require authentication
router.put('/profile', authMiddleware, upload.single('profilePicture'), updateProfile);

module.exports = router;
