const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, dateOfBirth, mobileNumber } = req.body;
    const userId = req.userId;
    let profilePicture = req.body.profilePicture;

    // Handle file upload
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile-pictures',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        });
        profilePicture = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload profile picture' });
      }
    }

    // Validation
    if (!firstName || firstName.trim().length < 2) {
      return res.status(400).json({ message: 'First name must be at least 2 characters' });
    }
    if (!lastName || lastName.trim().length < 2) {
      return res.status(400).json({ message: 'Last name must be at least 2 characters' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      if (dob >= new Date()) {
        return res.status(400).json({ message: 'Date of birth must be in the past' });
      }
    }
    if (mobileNumber && !/^\+?[\d\s-]{10,}$/.test(mobileNumber)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use by another account' });
    }

    // Update user
    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      mobileNumber: mobileNumber ? mobileNumber.trim() : undefined,
    };

    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profilePicture: updatedUser.profilePicture,
        dateOfBirth: updatedUser.dateOfBirth,
        mobileNumber: updatedUser.mobileNumber,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Something went wrong while updating profile',
      error: error?.message || 'Unknown error',
    });
  }
};
