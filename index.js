import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./src/config/dbConfig.js";
import UserRouter from "./src/router/userRouter.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// database connection
dbConnection();

// middleware

app.use(express.json());
app.use(cors());
// router
app.use("/api/v1/user", UserRouter);
app.use("/home", (req, res) => {
  res.json({
    msg: "Hi this is the new message from the CICD pipeline",
  });
});
app.use("/test", (req, res) => {
  res.json({
    msg: "Hi this is the new message from the test pipeline",
  });
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
