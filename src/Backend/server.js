const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('./User');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS setup
const allowedOrigins = [
    'https://the-press-point.vercel.app', // production frontend URL
    'http://localhost:3000', // local development frontend URL
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful', user: { name, email } });
    } catch (err) {
        console.error('❌ Signup error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
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

// GitHub OAuth routes
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.get('/auth/github', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user`);
});

app.get('/auth/github/callback', async (req, res) => {
    const code = req.query.code;

    try {
        // Get access token from GitHub
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            },
            { headers: { accept: 'application/json' } }
        );

        const accessToken = tokenResponse.data.access_token;

        // Get user information from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { login, name, avatar_url } = userResponse.data;

        // Redirect to frontend with GitHub data
        res.redirect(
            `${FRONTEND_URL}/github-success?login=${login}&name=${name}&avatar=${avatar_url}`
        );
    } catch (err) {
        console.error('OAuth Error:', err.message);
        res.status(500).send('Login failed');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
