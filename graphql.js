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
    userCount: Int!
  }

  type Mutation {
    createUser(name: String!, email: String!, username: String!, password: String!): User!
    deleteUser(id: Int!): Boolean!
  }
`;

const resolvers = {
  Query: {
    users: () => data.users,
    user: (_, { id }) => data.users.find(u => u.id === id),
    userCount: () => data.users.length,
  },
  Mutation: {
    createUser: (_, { name, email, username, password }) => {
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
    deleteUser: (_, { id }) => {
      const index = data.users.findIndex(u => u.id === id);
      if (index !== -1) {
        data.users.splice(index, 1);
        return true;
      }
      return false;
    },
  },
};

module.exports = { typeDefs, resolvers };