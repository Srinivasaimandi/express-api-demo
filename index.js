const express = require('express');
const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const { apiKeyAuth } = require('./middleware/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const PORT = 9899;

// Middleware: Parse JSON
app.use(express.json());

// Middleware: Set Content-Type header for all responses
app.use((req, res, next) => {
    // Don't set JSON content-type for Swagger UI or its assets
    if (req.path.startsWith('/api-docs')) {
        return next();
    }
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Serve Swagger UI at /api-docs/
app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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