const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3001;
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require('./schemas');
const { log } = require('console');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(_dirname, '../client/build/index.html'));
});

// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`use graphQL at http://localhost:${port}${server.graphqlPath}`);
    })
  })
};

startApolloServer(typeDefs, resolvers);