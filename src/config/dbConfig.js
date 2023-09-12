import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const dbConnection = () => {
  try {
    const connect = mongoose.connect(
      process.env.MONGOURL ||
        "mongodb+srv://ecomm_admin:jf6gn6NukvrnI6GB@cluster0.hapt5vb.mongodb.net/ecomm_database"
    );
    connect
      ? console.log("DB connection success")
      : console.log("Cannot connect to DB");
  } catch (error) {
    console.log(error);
  }
};
