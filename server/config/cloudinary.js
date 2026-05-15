const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxvdvyiqx',
  api_key: process.env.CLOUDINARY_API_KEY || '259681741243535',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'xkF-PnwxEpAGJue77LcRt98Qmfk',
});

module.exports = cloudinary;
