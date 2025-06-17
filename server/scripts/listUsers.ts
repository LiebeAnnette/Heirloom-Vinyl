import mongoose from "mongoose";
import db from "../src/config/connection";
import User from "../src/models/User";

async function listUsers() {
  await db;

  const users = await User.find({});
  if (users.length === 0) {
    console.log("No users found.");
  } else {
    console.log("Users in database:");
    users.forEach((user) => {
      console.log(`- ${user.username}`);
    });
  }

  process.exit();
}

listUsers();
