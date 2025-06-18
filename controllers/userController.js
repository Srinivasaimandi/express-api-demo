let data = require('../data.json');

exports.getAllUsers = (req, res) => {
    res.json(data.users);
};

exports.searchUsers = (req, res) => {
    const { name, email } = req.query;
    let results = data.users;

    if (name) {
        results = results.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (email) {
        results = results.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
    }

    res.json(results);
};

exports.getUserCount = (req, res) => {
    res.json({ count: data.users.length });
};

exports.getUserById = (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = data.users.find(user => user.id === userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.createUser = (req, res) => {
    const newUser = req.body;
    newUser.id = data.users.length + 1;
    data.users.push(newUser);
    res.status(201).json(newUser);
};

exports.bulkAddUsers = (req, res) => {
    const newUsers = req.body;
    newUsers.forEach(user => {
        user.id = data.users.length + 1;
        data.users.push(user);
    });
    res.status(201).json(newUsers);
};

exports.updateUser = (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = data.users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        const updatedUser = { ...data.users[userIndex], ...req.body };
        data.users[userIndex] = updatedUser;
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.deleteUser = (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = data.users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        data.users.splice(userIndex, 1);
        res.status(204).send({message: 'User deleted successfully'});
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};