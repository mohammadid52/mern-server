const mongoose = require("mongoose");
const { ApolloServer, PubSub } = require("apollo-server");
const chalk = require("chalk");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

const pubsub = new PubSub();

const PORT = process.env.PORT || 8080;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log(chalk.whiteBright.blueBright("DB connected"));
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(chalk.bgCyan.whiteBright(`Server running at ${res.url}`));
  })
  .catch((err) => {
    console.log(err);
  });
