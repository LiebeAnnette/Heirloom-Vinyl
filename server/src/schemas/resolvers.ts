// server/schemas/resolvers.ts

import { AuthenticationError } from "apollo-server-express";
import { Request } from "express";
import { User, Record } from "../models";
import { signToken } from "../utils/auth";

// Context type passed to resolvers
interface Context {
  user?: {
    _id: string;
    username: string;
  };
  req: Request;
}

// Input argument types for various mutations
interface LoginArgs {
  username: string;
  password: string;
}

interface AddRecordArgs {
  artist: string;
  album: string;
}

interface UpdateRecordArgs {
  recordId: string;
  artist?: string;
  album?: string;
}

interface DeleteRecordArgs {
  recordId: string;
}

interface SearchArgs {
  query: string;
}

const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) throw new AuthenticationError("Not logged in");
      return User.findById(context.user._id).populate("records");
    },

    myRecords: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) throw new AuthenticationError("Not logged in");
      return Record.find({ owner: context.user._id });
    },

    searchRecords: async (
      _: unknown,
      { query }: SearchArgs,
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError("Not logged in");

      const regex = new RegExp(query, "i");
      return Record.find({
        owner: context.user._id,
        $or: [{ artist: regex }, { album: regex }],
      });
    },
  },

  Mutation: {
    addUser: async (_: unknown, args: LoginArgs) => {
      const user = await User.create(args);
      const token = signToken({
        _id: user._id.toString(),
        username: user.username,
      });
      return { token, user };
    },

    login: async (_: unknown, { username, password }: LoginArgs) => {
      const user = await User.findOne({ username });
      if (!user) throw new AuthenticationError("User not found");

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) throw new AuthenticationError("Incorrect password");

      const token = signToken({
        _id: user._id.toString(),
        username: user.username,
      });
      return { token, user };
    },

    addRecord: async (
      _: unknown,
      { artist, album }: AddRecordArgs,
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError("Not logged in");

      const record = await Record.create({
        artist,
        album,
        owner: context.user._id,
      });

      await User.findByIdAndUpdate(context.user._id, {
        $push: { records: record._id },
      });

      return record;
    },

    deleteRecord: async (
      _: unknown,
      { recordId }: DeleteRecordArgs,
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError("Not logged in");

      const record = await Record.findOneAndDelete({
        _id: recordId,
        owner: context.user._id,
      });

      await User.findByIdAndUpdate(context.user._id, {
        $pull: { records: recordId },
      });

      return record;
    },

    updateRecord: async (
      _: unknown,
      { recordId, artist, album }: UpdateRecordArgs,
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError("Not logged in");

      const updated = await Record.findOneAndUpdate(
        { _id: recordId, owner: context.user._id },
        {
          $set: {
            ...(artist && { artist }),
            ...(album && { album }),
          },
        },
        { new: true }
      );

      return updated;
    },
    updateMultipleRecords: async (
      _: unknown,
      {
        recordIds,
        updates,
      }: {
        recordIds: string[];
        updates: { genre?: string; isFavorite?: boolean; listened?: boolean };
      },
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError("Not logged in");

      const result = await Record.updateMany(
        {
          _id: { $in: recordIds },
          owner: context.user._id,
        },
        {
          $set: updates,
        }
      );

      // Optionally return the updated records:
      const updatedRecords = await Record.find({
        _id: { $in: recordIds },
        owner: context.user._id,
      });

      return updatedRecords;
    },
  },
};

export default resolvers;
