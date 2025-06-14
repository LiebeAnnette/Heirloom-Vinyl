// server/models/User.ts

import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

// Interface representing a User document in MongoDB
export interface IUser extends Document<Types.ObjectId> {
  username: string;
  password: string;
  records: Types.ObjectId[];
  isCorrectPassword(password: string): Promise<boolean>;
}

// Schema definition
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    records: [
      {
        type: Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
  },
  {
    timestamps: true, // optional: adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to hash password
userSchema.pre<IUser>("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Instance method to validate password
userSchema.methods.isCorrectPassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Export the model
const User = model<IUser>("User", userSchema);
export default User;
