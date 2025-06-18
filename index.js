const express = require('express');
const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const { apiKeyAuth } = require('./middleware/auth');

const app = express();
const PORT = 9899;

// Middleware: Parse JSON
app.use(express.json());

// Middleware: Set Content-Type header for all responses
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Public routes
app.use('/api', loginRoutes);

// API key authorization middleware (protects all routes below)
app.use(apiKeyAuth);

// Protected routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});