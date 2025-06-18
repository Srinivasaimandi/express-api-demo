const express = require('express');
const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const { apiKeyAuth } = require('./middleware/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql');

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

// --- GraphQL Setup ---
async function startApolloServer() {
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        introspection: true 
    });
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    // Protected routes (apply apiKeyAuth only here)
    app.use('/api/users', apiKeyAuth, userRoutes);

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Swagger API Docs are at http://localhost:${PORT}/api-docs/`);
        console.log(`GraphQL endpoint at http://localhost:${PORT}/graphql`);
    });
}
startApolloServer();