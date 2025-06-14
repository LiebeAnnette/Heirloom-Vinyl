// server/schemas/typeDefs.ts
import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    records: [Record]
  }

  type Record {
    _id: ID!
    artist: String!
    album: String!
    owner: User!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User
    myRecords: [Record]
    searchRecords(query: String!): [Record]
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    addRecord(artist: String!, album: String!): Record
    deleteRecord(recordId: ID!): Record
    updateRecord(recordId: ID!, artist: String, album: String): Record
  }
`;
