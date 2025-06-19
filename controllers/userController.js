/**
 * @author: srinivasaimandi
 */

let data = require("../data.json");
const User = require("../models/User");

exports.getAllUsers = (req, res) => {
    res.json(data.users);
};

exports.searchUsers = (req, res) => {
    const { name, email } = req.query;
    let results = data.users;

    if (name) {
        results = results.filter((user) =>
            user.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    if (email) {
        results = results.filter((user) =>
            user.email.toLowerCase().includes(email.toLowerCase())
        );
    }

    res.json(results);
};

exports.getUserCount = (req, res) => {
    res.json({ count: data.users.length });
};

exports.getUserById = (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = data.users.find((user) => user.id === userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

exports.createUser = (req, res) => {
    const newUserData = req.body;
    const newUser = new User({
        id: data.users.length + 1,
        name: newUserData.name,
        email: newUserData.email,
        username: newUserData.username,
        password: newUserData.password,
    });
    if (
        !newUser.name ||
        !newUser.email ||
        !newUser.username ||
        !newUser.password
    ) {
        return res
            .status(400)
            .json({ message: "All fields are required for each user" });
    } else if (
        data.users.some((existingUser) => existingUser.email === newUser.email)
    ) {
        return res
            .status(400)
            .json({ message: `Email ${newUser.email} already exists` });
    } else if (
        data.users.some(
            (existingUser) => existingUser.username === newUser.username
        )
    ) {
        return res
            .status(400)
            .json({ message: `Username ${newUser.username} already exists` });
    } else {
        data.users.push(newUser);
        return res.status(201).json(newUser);
    }
};

exports.bulkAddUsers = (req, res) => {
    const newUsersData = req.body;
    const newUsers = newUsersData.map(
        (userData, index) =>
            new User({
                id: data.users.length + index + 1,
                name: userData.name,
                email: userData.email,
                username: userData.username,
                password: userData.password,
            })
    );
    newUsers.forEach((user) => {
        if (!user.name || !user.email || !user.username || !user.password) {
            return res
                .status(400)
                .json({ message: "All fields are required for each user" });
        } else if (
            data.users.some((existingUser) => existingUser.email === user.email)
        ) {
            return res
                .status(400)
                .json({ message: `Email ${user.email} already exists` });
        } else if (
            data.users.some((existingUser) => existingUser.username === user.username)
        ) {
            return res
                .status(400)
                .json({ message: `Username ${user.username} already exists` });
        } else {
            data.users.push(user);
        }
    });
    res.status(201).json(newUsers);
};

exports.updateUser = (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = data.users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
        const updatedUser = { ...data.users[userIndex], ...req.body };
        data.users[userIndex] = updatedUser;
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

exports.deleteUser = (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = data.users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
        data.users.splice(userIndex, 1);
        res.status(204).send({ message: "User deleted successfully" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};
