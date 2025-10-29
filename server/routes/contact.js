// routes/contact.js
const express = require("express");
const Contact = require("../models/Contact"); // <-- Contact model we just fixed
const router = express.Router();

// POST - Save contact form data
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newContact = new Contact(req.body);
    await newContact.save();
    res.json({ message: "Contact form submitted successfully!" });
  } catch (err) {
    console.error("Contact save error:", err);
    const status = err?.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ message: "Error saving contact data", error: err.message });
  }
});

module.exports = router;
