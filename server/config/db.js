// C:\Users\Audit\Documents\MERN\TF_Arena\server\config\db.js

const mongoose = require("mongoose");
const path = require("path");

// Also load dotenv here as a backup
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    console.log("🔍 db.js sees MONGO_URI:", uri);

    if (!uri) {
      throw new Error(
        "MONGO_URI is not defined!\n" +
          "  Expected .env at: " +
          path.join(__dirname, "../.env") +
          "\n" +
          "  Please create the .env file in your server/ folder.",
      );
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
