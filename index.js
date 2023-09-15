import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./src/config/dbConfig.js";
import UserRouter from "./src/router/userRouter.js";
import authRouter from "./src/router/auth.js";
import productRouter from "./src/router/productRouter.js";
import orderRouter from "./src/router/orderRouter.js";
import cartRouter from "./src/router/cartRouter.js";
import stripeRouter from "./src/router/stripe.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// database connection
dbConnection();

// middleware

app.use(express.json());
app.use(cors());
// router

app.use("/v1/user", UserRouter);
app.use("/v1/user", authRouter);
app.use("/v1/products", productRouter);
app.use("/v1/order", orderRouter);
app.use("/v1/cart", cartRouter);
app.use("/v1/checkout", stripeRouter);
// global error handler
app.use((error, req, res, next) => {
  console.log(error);

  const statusCode = error.code || 404;
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
