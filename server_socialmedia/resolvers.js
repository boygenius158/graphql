const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const messages = [];
const MESSAGE_SENT = 'MESSAGE_SENT';

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    sendMessage: (_, { user, content }) => {
      const message = { id: String(messages.length + 1), user, content };
      messages.push(message);
      pubsub.publish(MESSAGE_SENT, { messageSent: message });
      return message;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: () => pubsub.asyncIterator([MESSAGE_SENT]),
    },
  },
};

module.exports = resolvers;