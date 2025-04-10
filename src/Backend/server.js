const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./User'); // Make sure User.js is in the same folder
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
    origin: "https://the-press-point.vercel.app", // 👈 allow Vercel frontend
    credentials: true
}));

app.use(express.json());
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://madhav:7uJJp6mKZehs82Yo@cluster0.fzje2ti.mongodb.net/signup-demo?retryWrites=true&w=majority')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Signup Route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.password !== password)
            return res.status(401).json({ message: 'Incorrect password' });

        res.status(200).json({
            message: 'Login successful',
            user: { name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT} or on Render`);
});
