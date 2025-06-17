import mongoose from "mongoose";
import * as XLSX from "xlsx";
import dotenv from "dotenv";
import path from "path";
import Record from "../src/models/Record";
import User from "../src/models/User";

dotenv.config();
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/your_db_name";

async function importRecords() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // TODO: Replace with your actual user ID
    const allUsers = await User.find({});
    console.log(
      "Users in DB:",
      allUsers.map((u) => u.username)
    );

    const user = await User.findOne({ username: "user" });
    if (!user) {
      console.error(
        "❌ User not found. Double-check username casing or DB connection."
      );
      return;
    }

    console.log("✅ Found user:", user.username);

    // Load Excel file
    const filePath = path.join(__dirname, "../../server/data/HVExcel.xlsx");
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const records = XLSX.utils.sheet_to_json(sheet) as {
      artist: string;
      album: string;
    }[];

    console.log(`Importing ${records.length} records...`);

    for (const record of records) {
      if (!record.artist || !record.album) continue;

      const newRecord = new Record({
        artist: record.artist,
        album: record.album,
        owner: user._id,
      });

      await newRecord.save();

      console.log(`✔ Saved: ${record.artist} - ${record.album}`);

      user.records.push(newRecord._id as mongoose.Types.ObjectId);
    }

    await user.save();

    console.log("Import complete.");
    process.exit(0);
  } catch (err) {
    console.error("Import failed:", err);
    process.exit(1);
  }
}

importRecords();
