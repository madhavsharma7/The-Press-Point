const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./User');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'https://the-press-point.vercel.app',
    'http://localhost:3000' // 👈 Add this!
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://madhav:7uJJp6mKZehs82Yo@cluster0.fzje2ti.mongodb.net/signup-demo?retryWrites=true&w=majority')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Signup Route
app.post('/signup', async (req, res) => {
    console.log('📥 Signup request received:', req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('❌ Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: { name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT} or on Render`);
});
