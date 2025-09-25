const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./User");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = [
    "http://localhost:3000", // dev
    "https://the-press-point.vercel.app", // prod
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`Blocked by CORS: ${origin}`);
                callback(null, false);
            }
        },
        credentials: true,
    })
);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });

// Proxy route for GNews
app.get("/api/news/search", async (req, res) => {
    const { q = "example" } = req.query;

    try {
        const response = await fetch(
            `https://gnews.io/api/v4/search?q=${q}&lang=en&country=in&max=12&apikey=${process.env.GNEWS_API_KEY}`
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch from GNews" });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Signup route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ message: "User already exists" });

        const newUser = new User({ name, email, password }); // ⚠️ should hash password
        await newUser.save();

        res.status(201).json({ message: "Signup successful", user: { name, email } });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.password !== password) // ⚠️ should use bcrypt.compare
            return res.status(401).json({ message: "Incorrect password" });

        res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
