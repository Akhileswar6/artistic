const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage for user profile pictures
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_profiles", // Files will be stored in this folder on Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional: Auto-resize
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
