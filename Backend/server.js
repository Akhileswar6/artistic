require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitizer = require("./middleware/mongoSanitize");
const { globalLimiter } = require("./middleware/rateLimiters");
const xssSanitizer = require("./middleware/xssMiddleware");

const app = express();

// Security HTTP Headers & Rate Limiting
app.use(cors({
  origin: [
    "http://localhost:5173",            // local frontend
    "https://artistic-zeta.vercel.app"  // deployed frontend
  ],
  credentials: true
}));
app.use(helmet());
app.use(globalLimiter);

// Body Parser Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Data Sanitization
app.use(mongoSanitizer);
app.use(xssSanitizer);

// Routes
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const orderRoutes = require("./routes/orderRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Public / User Available Coupons Endpoint
const { getAvailableCoupons } = require("./controllers/orderController");
const { optionalAuth } = require("./middleware/authMiddleware");
app.get("/api/coupons/available", optionalAuth, getAvailableCoupons);

// Public Config Endpoint (Maintenance Mode & Pricing Configuration)
const SystemConfig = require("./models/SystemConfig");
app.get("/api/config", async (req, res) => {
  try {
    const config = await SystemConfig.findOne();
    res.json({ 
      maintenanceMode: config?.maintenanceMode || false,
      baseArtworkPrice: config?.baseArtworkPrice ?? 0,
      artworkStyles: {
        sketch: config?.artworkStyles?.sketch ?? config?.basePricing?.sketch ?? 300,
        realistic: config?.artworkStyles?.realistic ?? config?.basePricing?.realistic ?? 500,
        couple: config?.artworkStyles?.couple ?? config?.basePricing?.couple ?? 700,
        anime: config?.artworkStyles?.anime ?? config?.basePricing?.anime ?? 600,
        charcoal: config?.artworkStyles?.charcoal ?? config?.basePricing?.charcoal ?? 500,
        caricature: config?.artworkStyles?.caricature ?? config?.basePricing?.caricature ?? 400,
        digital: config?.artworkStyles?.digital ?? config?.basePricing?.digital ?? 200,
      },
      basePricing: config?.basePricing || {},
      framePricing: config?.framePricing || {},
      extraPersonCharge: config?.extraPersonCharge ?? 300,
      rushDeliveryCharge: config?.rushDeliveryCharge ?? 400,
      shippingCharge: config?.shippingCharge ?? 0,
      gstPercentage: config?.gstPercentage ?? 0,
      allowRushDelivery: config?.allowRushDelivery ?? true,
      maxQuantity: config?.maxQuantity ?? 10,
      maxExtraPeople: config?.maxExtraPeople ?? 10,
      discountPercentage: config?.discountPercentage ?? 0,
      contactPhone: config?.contactPhone || "+91 8886044716",
      contactEmail: config?.contactEmail || "support@artistic.com",
      announcement: config?.announcement || "Welcome to Artistic!",
    });
  } catch(err) {
    res.status(500).json({ maintenanceMode: false, basePricing: {}, framePricing: {} });
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

server.on('error', (err) => {
  console.error('❌ Server Error:', err);
});
