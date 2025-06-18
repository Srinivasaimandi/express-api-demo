const express = require('express');
const crypto = require('crypto');
const data = require('../data.json');
const { addApiKey } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
        const newApiKey = crypto.randomUUID();
        addApiKey(newApiKey);
        res.json({ apiKey: newApiKey });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;