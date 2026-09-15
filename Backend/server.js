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


app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/gallery", galleryRoutes);

// Public Config Endpoint (Maintenance Mode)
const SystemConfig = require("./models/SystemConfig");
app.get("/api/config", async (req, res) => {
  try {
    const config = await SystemConfig.findOne();
    res.json({ 
      maintenanceMode: config?.maintenanceMode || false,
      basePricing: config?.basePricing || {},
      framePricing: config?.framePricing || {}
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
