const { User, Record } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (context.user) {
        return await User.findById(context.user._id).populate("records");
      }
      throw new AuthenticationError("Not logged in");
    },
    myRecords: async (_, __, context) => {
      if (context.user) {
        return await Record.find({ owner: context.user._id });
      }
      throw new AuthenticationError("Not logged in");
    },
    searchRecords: async (_, { query }, context) => {
      if (context.user) {
        const regex = new RegExp(query, "i");
        return await Record.find({
          owner: context.user._id,
          $or: [{ artist: regex }, { album: regex }],
        });
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new AuthenticationError("User not found");

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) throw new AuthenticationError("Incorrect password");

      const token = signToken(user);
      return { token, user };
    },
    addRecord: async (_, { artist, album }, context) => {
      if (context.user) {
        const record = await Record.create({
          artist,
          album,
          owner: context.user._id,
        });
        await User.findByIdAndUpdate(context.user._id, {
          $push: { records: record._id },
        });
        return record;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
};

module.exports = resolvers;
