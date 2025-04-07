const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend origin
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/signup-demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Signup Route
app.post('/signup', async (req, res) => {
    console.log('Signup request received:', req.body);
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

// Start Server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
