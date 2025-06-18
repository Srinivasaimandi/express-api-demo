const { gql } = require('apollo-server-express');
const data = require('./data.json');

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    username: String!
    password: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    searchUsers(name: String, email: String): [User!]!
    userCount: Int!
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      username: String!
      password: String!
    ): User!
    bulkAddUsers(users: [NewUserInput!]!): [User!]!
    updateUser(
      id: Int!
      name: String
      email: String
      username: String
      password: String
    ): User
    deleteUser(id: Int!): Boolean!
  }

  input NewUserInput {
    name: String!
    email: String!
    username: String!
    password: String!
  }
`;

const resolvers = {
  Query: {
    users: () => data.users,
    user: (_, { id }) => data.users.find(u => u.id === id),
    searchUsers: (_, { name, email }) => {
      let results = data.users;
      if (name) {
        results = results.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
      }
      if (email) {
        results = results.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
      }
      return results;
    },
    userCount: () => data.users.length,
  },
  Mutation: {
    createUser: (_, { name, email, username, password }) => {
      if (
        data.users.some(u => u.email === email) ||
        data.users.some(u => u.username === username)
      ) {
        throw new Error('Email or username already exists');
      }
      const newUser = {
        id: data.users.length + 1,
        name,
        email,
        username,
        password,
      };
      data.users.push(newUser);
      return newUser;
    },
    bulkAddUsers: (_, { users: newUsers }) => {
      const addedUsers = [];
      newUsers.forEach(userData => {
        if (
          data.users.some(u => u.email === userData.email) ||
          data.users.some(u => u.username === userData.username)
        ) {
          // skip duplicates
          return;
        }
        const newUser = {
          id: data.users.length + 1,
          ...userData,
        };
        data.users.push(newUser);
        addedUsers.push(newUser);
      });
      return addedUsers;
    },
    updateUser: (_, { id, ...updates }) => {
      const userIndex = data.users.findIndex(u => u.id === id);
      if (userIndex === -1) return null;
      data.users[userIndex] = { ...data.users[userIndex], ...updates };
      return data.users[userIndex];
    },
    deleteUser: (_, { id }) => {
      const userIndex = data.users.findIndex(u => u.id === id);
      if (userIndex === -1) return false;
      data.users.splice(userIndex, 1);
      return true;
    },
  },
};

module.exports = { typeDefs, resolvers };