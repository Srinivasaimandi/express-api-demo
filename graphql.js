/**
 * @author: srinivasaimandi
 */

const { gql } = require("apollo-server-express");
const { getData, saveData } = require("./utils/dataUtils");

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
    users: () => {
      const data = getData();
      return data.users;
    },
    user: (_, { id }) => {
      const data = getData();
      return data.users.find((u) => u.id === id);
    },
    searchUsers: (_, { name, email }) => {
      const data = getData();
      let results = data.users;
      if (name) {
        results = results.filter((u) =>
          u.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      if (email) {
        results = results.filter((u) =>
          u.email.toLowerCase().includes(email.toLowerCase())
        );
      }
      return results;
    },
    userCount: () => {
      const data = getData();
      return data.users.length;
    },
  },
  Mutation: {
    createUser: (_, { name, email, username, password }) => {
      const data = getData();
      if (
        data.users.some((u) => u.email === email) ||
        data.users.some((u) => u.username === username)
      ) {
        throw new Error("Email or username already exists");
      }
      const maxId = data.users.reduce(
        (max, user) => (user.id > max ? user.id : max),
        0
      );
      const newUser = {
        id: maxId + 1,
        name,
        email,
        username,
        password,
      };
      data.users.push(newUser);
      saveData(data);
      return newUser;
    },
    bulkAddUsers: (_, { users: newUsers }) => {
      const data = getData();
      const addedUsers = [];
      const maxId = data.users.reduce(
        (max, user) => (user.id > max ? user.id : max),
        0
      );
      newUsers.forEach(userData, (index) => {
        if (
          data.users.some((u) => u.email === userData.email) ||
          data.users.some((u) => u.username === userData.username)
        ) {
          // skip duplicates
          return;
        }
        const newUser = {
          id: maxId + index + 2,
          ...userData,
        };
        data.users.push(newUser);
        addedUsers.push(newUser);
      });
      saveData(data);
      return addedUsers;
    },
    updateUser: (_, { id, ...updates }) => {
      const data = getData();
      const userIndex = data.users.findIndex((u) => u.id === id);
      if (userIndex === -1) return null;
      data.users[userIndex] = { ...data.users[userIndex], ...updates };
      saveData(data);
      return data.users[userIndex];
    },
    deleteUser: (_, { id }) => {
      const data = getData();
      const userIndex = data.users.findIndex((u) => u.id === id);
      if (userIndex === -1) return false;
      data.users.splice(userIndex, 1);
      saveData(data);
      return true;
    },
  },
};

module.exports = { typeDefs, resolvers };
