import express from "express";
import User from "../model/User.js";
const router = express.Router();

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const newUser = new User({
      username,
      email,
      password,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
  } catch (error) {
    next(error);
  }
});

router.get("/login", async (req, res, next) => {
  try {
    const user = await User.find();
    console.log(user);
    res.json({
      status: "success",
      message: user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
