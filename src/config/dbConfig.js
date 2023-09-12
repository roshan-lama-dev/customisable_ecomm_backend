import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const dbConnection = () => {
  try {
    const connect = mongoose.connect(process.env.MONGOURL);
    connect
      ? console.log("DB connection success")
      : console.log("Cannot connect to DB");
  } catch (error) {
    console.log(error);
  }
};
