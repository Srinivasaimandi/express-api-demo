const express = require('express');
const app = express();
const PORT = 9899;
const crypto = require('crypto');
const userRoutes = require('./users');
const data = require('./data.json'); // Add this to access user data

const VALID_API_KEY = 'b7f2e1a4-9c3d-4e8a-8f2e-2c1a7d6b5e9c'; // Change this to your actual API key
let validApiKeys = [VALID_API_KEY]; // Start with your existing key

app.use(express.json());

// // API key generation endpoint
// app.post('/api/generate-api-key', (req, res) => {
//     const newApiKey = crypto.randomUUID();
//     validApiKeys.push(newApiKey);
//     res.json({ apiKey: newApiKey });
// });

// API key generation with user credentials
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
        const newApiKey = crypto.randomUUID();
        validApiKeys.push(newApiKey);
        res.json({ apiKey: newApiKey });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// API key middleware
app.use((req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!validApiKeys.includes(apiKey)) {
        return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    }
    next();
});

// Set Content-Type header for all responses
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/api/users', userRoutes);