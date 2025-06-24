/**
 * @author: srinivasaimandi
 */

const { getData, saveData } = require("../utils/dataUtils");
const User = require("../models/User");

exports.getAllUsers = (req, res) => {
  const data = getData();
  res.json(data.users);
};

exports.searchUsers = (req, res) => {
  const data = getData();
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
  const data = getData();
  res.json({ count: data.users.length });
};

exports.getUserById = (req, res) => {
  const data = getData();
  const userId = parseInt(req.params.id, 10);
  const user = data.users.find((user) => user.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.createUser = (req, res) => {
  const data = getData();
  const newUserData = req.body;
  const maxId = data.users.reduce(
    (max, user) => (user.id > max ? user.id : max),
    0
  );
  const newUser = new User({
    id: maxId + 1,
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
    saveData(data);
    return res.status(201).json(newUser);
  }
};

exports.bulkAddUsers = (req, res) => {
  const data = getData();
  const newUsersData = req.body;
  const maxId = data.users.reduce(
    (max, user) => (user.id > max ? user.id : max),
    0
  );
  const newUsers = newUsersData.map(
    (userData, index) =>
      new User({
        id: maxId + index + 2,
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
  saveData(data);
  res.status(201).json(newUsers);
};

exports.updateUser = (req, res) => {
  const data = getData();
  const userId = parseInt(req.params.id, 10);
  const userIndex = data.users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    const updatedUser = { ...data.users[userIndex], ...req.body };
    data.users[userIndex] = updatedUser;
    saveData(data);
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.deleteUser = (req, res) => {
  const data = getData();
  const userId = parseInt(req.params.id, 10);
  const userIndex = data.users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    data.users.splice(userIndex, 1);
    saveData(data);
    res.status(204).send({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
