const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./User');
const dotenv = require('dotenv');
// const { auth } = require('express-openid-connect'); // 👈 Add this line

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

// const { requiresAuth } = require('express-openid-connect');

// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
// });


// Auth0 configuration 👇
// const authConfig = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.AUTH0_SECRET || '9f1c2e4a7b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9',
//     baseURL: process.env.BASE_URL || 'http://localhost:5000',
//     clientID: process.env.AUTH0_CLIENT_ID || 'KkhWx5j4yxjzX8CHcgQkLGqUlpt4IlrZ',
//     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-o2avgzm1na1pcjq4.us.auth0.com'
// };

// app.use(auth(authConfig)); // 👈 Add this to enable Auth0

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'your-fallback-mongo-uri')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Auth check route
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? '✅ Logged in with Auth0' : '🚪 Logged out');
});

// Signup Route
app.post('/signup', async (req, res) => {
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

// Github Login

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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

        // Send data to frontend (you can redirect with query params or JWT)
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
