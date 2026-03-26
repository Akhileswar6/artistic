require("dotenv").config(); // MUST be first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173",           // local frontend
    "https://artistic-chi.vercel.app"  // deployed frontend
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});