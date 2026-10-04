const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { verifyAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { generatePresignedUrl } = require('../utils/s3utils');

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    
    // Generate pre-signed URLs for all images
    const populatedTestimonials = await Promise.all(
      testimonials.map(async (item) => {
        const itemObj = item.toObject();
        if (itemObj.imageUrl) {
          itemObj.imageUrl = await generatePresignedUrl(itemObj.imageUrl);
        }
        return itemObj;
      })
    );

    res.json(populatedTestimonials);
  } catch (err) {
    console.error('Testimonial Fetch Error:', err);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

// POST new testimonial (Admin Only)
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, city, artStyle, text, rating, isFeatured } = req.body;

    const newItem = await Testimonial.create({
      imageUrl: req.file ? req.file.key : null,
      name,
      city,
      artStyle,
      text,
      rating: Number(rating) || 5,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    const populatedItem = newItem.toObject();
    if (populatedItem.imageUrl) {
      populatedItem.imageUrl = await generatePresignedUrl(populatedItem.imageUrl);
    }

    res.status(201).json(populatedItem);
  } catch (err) {
    console.error('Testimonial Create Error:', err);
    res.status(500).json({ message: 'Failed to create testimonial' });
  }
});

// PATCH toggle featured (Admin Only)
router.patch('/:id/toggle-feature', verifyAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    testimonial.isFeatured = !testimonial.isFeatured;
    await testimonial.save();
    
    res.json(testimonial);
  } catch (err) {
    console.error('Testimonial Toggle Error:', err);
    res.status(500).json({ message: 'Failed to toggle feature status' });
  }
});

// DELETE testimonial (Admin Only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Testimonial Delete Error:', err);
    res.status(500).json({ message: 'Failed to delete testimonial' });
  }
});

module.exports = router;
