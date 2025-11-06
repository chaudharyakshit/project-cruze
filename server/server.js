// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
const fs = require('fs');
const contactRoutes = require("./routes/contact");
const dealershipRoutes = require("./routes/dealership");
const chatUserRoutes = require("./routes/chatuser");

dotenv.config();

const app = express();

// ===== CORS Setup =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://ecocruze.in",
  "https://www.ecocruze.in"
];

// Add environment-specific origins
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    console.warn(`CORS blocked request from origin: ${origin}`);
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true
}));

// Handle preflight requests (✅ FIXED)
app.options(/.*/, cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ===== Middleware =====
app.use(express.json());

// Serve static files with caching
app.use(express.static('dist', {
  maxAge: '30d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // Don't cache HTML files
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|webp|ico|svg)$/)) {
      // Cache assets for 30 days
      res.setHeader('Cache-Control', 'public, max-age=2592000');
      // Add security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }
}));

// ===== Routes =====
app.use("/api/dealership", dealershipRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chatuser", chatUserRoutes);

// Test route to check CORS and server
app.get("/api/test", (req, res) => {
  res.json({ message: "Server and CORS are working!" });
});

// SPA fallback: serve index.html for client-side routes (only if `dist/index.html` exists)
// Fallback for client-side routing: serve index.html for non-API requests
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();

  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

// ===== Connect to MongoDB =====
// Attempt to connect to MongoDB if MONGO_URI is provided. If not provided,
// start the server anyway (useful for serving static `dist` during deploy checks).
const startServer = () => {
  const PORT = process.env.PORT || 5001;
  const HOST = process.env.HOST || "0.0.0.0";

  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on ${HOST}:${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Allowed Origins: ${allowedOrigins.join(", ")}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      if (mongoose.connection) {
        mongoose.connection.close();
      }
      process.exit(0);
    });
  });
};

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB Connected");
      startServer();
    })
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:", err);
      // Still start the server in a degraded mode so static site can be served and APIs that don't need DB can be used for testing.
      console.warn('Starting server without DB connection (degraded mode).');
      startServer();
    });
} else {
  console.warn('MONGO_URI not set — starting server without DB connection (degraded mode).');
  startServer();
}
