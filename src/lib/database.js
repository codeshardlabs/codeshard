import mongoose from "mongoose";

export default function connectToDB() {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database Connection Error");
  }
}
