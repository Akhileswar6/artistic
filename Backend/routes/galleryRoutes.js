const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const { verifyAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { generatePresignedUrl } = require("../utils/s3utils");

// GET all gallery items
router.get("/", async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    
    // Generate pre-signed URLs for all images
    const populatedGallery = await Promise.all(
      galleryItems.map(async (item) => {
        const itemObj = item.toObject();
        itemObj.imageUrl = await generatePresignedUrl(itemObj.imageUrl);
        return itemObj;
      })
    );

    res.json(populatedGallery);
  } catch (err) {
    console.error("Gallery Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch gallery items" });
  }
});

// POST a new gallery item (Admin Only)
router.post("/", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { title, instagramLink, date, category, description, displayLocations } = req.body;

    let parsedLocations = [];
    if (displayLocations) {
      try {
        parsedLocations = JSON.parse(displayLocations);
      } catch (e) {
        parsedLocations = typeof displayLocations === 'string' ? [displayLocations] : displayLocations;
      }
    }

    const newItem = await Gallery.create({
      imageUrl: req.file.key, // Save S3 object key instead of full location
      title,
      instagramLink,
      date,
      category,
      description,
      displayLocations: parsedLocations,
    });

    const populatedItem = newItem.toObject();
    populatedItem.imageUrl = await generatePresignedUrl(populatedItem.imageUrl);

    res.status(201).json(populatedItem);
  } catch (err) {
    console.error("Gallery Upload Error:", err);
    res.status(500).json({ message: "Failed to upload gallery item" });
  }
});

// DELETE a gallery item (Admin Only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Gallery Delete Error:", err);
    res.status(500).json({ message: "Failed to delete gallery item" });
  }
});

module.exports = router;
