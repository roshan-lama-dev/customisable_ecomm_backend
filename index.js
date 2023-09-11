import express from "express";
import dotenv from "dotenv";
import { dbConnection } from "./src/config/dbConfig.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// database connection
dbConnection();
app.use("/", (req, res) => {
  res.send("Helloo");
});

// global error handler
app.use((error, req, res, next) => {
  const statusCode = error.errorCode || 404;
  res.status(statusCode).json({
    status: "error",
    message: error.message,
  });
});
app.listen(PORT, (err) => {
  err
    ? console.log(err)
    : console.log(`Server is running in http://localhost:${PORT}`);
});
