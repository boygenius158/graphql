const { gql } = require('graphql-tag'); // Import gql from graphql-tag

const typeDefs = gql`
  type Message {
    id: ID!
    user: String!
    content: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    sendMessage(user: String!, content: String!): Message!
  }

  type Subscription {
    messageSent: Message!
  }
`;

module.exports = typeDefs;