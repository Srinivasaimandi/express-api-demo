const express = require('express');
const app = express();
const PORT = 9899;
let data = require('./data.json');

const VALID_API_KEY = 'b7f2e1a4-9c3d-4e8a-8f2e-2c1a7d6b5e9c'; // Change this to your actual API key

app.use(express.json());

// API key middleware
app.use((req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (apiKey !== VALID_API_KEY) {
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

app.get('/api/users', (req, res) => {
    res.json(data.users);
});

app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = data.users.find(user => user.id === userId);
    
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.post('/api/users', (req, res) => {
    const newUser = req.body;
    newUser.id = data.users.length + 1; // Simple ID generation
    data.users.push(newUser);
    res.status(201).json(newUser);

});

app.post('/api/users/bulk', (req, res) => {
    const newUsers = req.body;
    newUsers.forEach(user => {
        user.id = data.users.length + 1;
        data.users.push(user);
    });
    res.status(201).json(newUsers);
});

app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = data.users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        const updatedUser = { ...data.users[userIndex], ...req.body };
        data.users[userIndex] = updatedUser;
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = data.users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        data.users.splice(userIndex, 1);
        res.status(204).send({message: 'User deleted successfully'});
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.get('/api/users/search', (req, res) => {
    const { name, email } = req.query;
    let results = data.users;

    if (name) {
        results = results.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (email) {
        results = results.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
    }

    res.json(results);
});

app.get('/api/users/count', (req, res) => {
    res.json({ count: data.users.length });
});