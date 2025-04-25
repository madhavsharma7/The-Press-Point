const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./User');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const allowedOrigins = [
    'https://the-press-point.vercel.app',
    'http://localhost:3000'
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
mongoose.connect(process.env.MONGO_URI || 'your-fallback-mongo-uri')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Signup Route
app.post('/signup', async (req, res) => {
    console.log("📥 Signup request body:", req.body);

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        console.log("❌ Missing fields");
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ Email already in use");
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        console.log("✅ User created");
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('❌ Error during signup:', error); 
        res.status(500).json({ message: 'Internal server error', error: error.message });
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

// Github Login

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
// const axios = require('axios');

// Step 1: Redirect to GitHub for login
app.get('/auth/github', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user`);
});

// Step 2: GitHub redirects here with code → Exchange it for access token
app.get('/auth/github/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            },
            {
                headers: { accept: 'application/json' },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { login, name, avatar_url } = userResponse.data;

        res.redirect(`http://localhost:3000/github-success?login=${login}&name=${name}&avatar=${avatar_url}`);
    } catch (err) {
        console.error('OAuth Error:', err.message);
        res.status(500).send('Login failed');
    }
});

app.listen(PORT, () => {
    console.log(`✅ GitHub OAuth server running at http://localhost:${PORT}`);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

