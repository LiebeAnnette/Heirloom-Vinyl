import express from "express";
import { ApolloServer } from "apollo-server-express";
import db from "./config/connection";
import { typeDefs, resolvers } from "./schemas";
import { authMiddleware } from "./utils/auth";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();
  server.applyMiddleware({ app: app as any });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 API server running on http://localhost:${PORT}`);
      console.log(
        `🔗 GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
}

startServer();
