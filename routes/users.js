const express = require('express');
const router = express.Router();

let data = require('../data.json');

// Get all users
router.get('/', (req, res) => {
    res.json(data.users);
});

// Search users
router.get('/search', (req, res) => {
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

// Get user count
router.get('/count', (req, res) => {
    res.json({ count: data.users.length });
});

// Get user by ID
router.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = data.users.find(user => user.id === userId);
    
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Create new user
router.post('/', (req, res) => {
    const newUser = req.body;
    newUser.id = data.users.length + 1;
    data.users.push(newUser);
    res.status(201).json(newUser);
});

// Bulk add users
router.post('/bulk', (req, res) => {
    const newUsers = req.body;
    newUsers.forEach(user => {
        user.id = data.users.length + 1;
        data.users.push(user);
    });
    res.status(201).json(newUsers);
});

// Update user
router.put('/:id', (req, res) => {
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

// Delete user
router.delete('/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = data.users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        data.users.splice(userIndex, 1);
        res.status(204).send({message: 'User deleted successfully'});
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;