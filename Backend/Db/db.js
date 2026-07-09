import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  quiet: true,
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};
export default connectDB;
