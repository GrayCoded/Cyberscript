const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { auth } = require('express-oauth2-jwt-bearer');
//const { verifyToken } = require('./utils/authMiddleware')

require('dotenv').config()

const jwtCheck = auth({
  audience: 'localhost:3001/graphql',
  issuerBaseURL: 'https://dev-2kax28qvyzlsa7s0.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

const { typeDefs, resolvers } = require('./schemas/')
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: jwtCheck,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer(typeDefs, resolvers);