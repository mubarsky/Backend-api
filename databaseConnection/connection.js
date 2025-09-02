

import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    console.log("MONGO_URI from env:", process.env.MONGO_URI); // 🔍 debug
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};

export default connectToDatabase;
