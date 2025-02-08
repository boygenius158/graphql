const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();
const httpServer = createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    },
  ],
});

async function startServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  httpServer.listen(4000, () => {
    console.log(`Server ready at http://localhost:4000${apolloServer.graphqlPath}`);

    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server: httpServer,
        path: apolloServer.graphqlPath,
      }
    );
  });
}

startServer();