import express from "express";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import Cryptojs from "crypto-js";
const router = express.Router();

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const newUser = new User({
      username,
      email,
      password: Cryptojs.AES.encrypt(
        password,
        process.env.PASS_SECERET
      ).toString(),
    });
    const savedUser = await newUser.save();
    if (
      savedUser?._id
        ? res.status(200).json({
            status: "success",
            message: "Registered Successfully",
          })
        : res.json({
            status: "error",
            message: "Cannot create user",
          })
    )
      console.log(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      // Change the error message
      error.message = "Email or username is already in use.";
      error.code = 501;
    }
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    !user &&
      res.status(401).json({
        status: "error",
        message: "Wrong Credentials. No user",
      });
    const hashedPassword = Cryptojs.AES.decrypt(
      user.password,
      process.env.PASS_SECERET
    );

    const passwordUser = hashedPassword.toString(Cryptojs.enc.Utf8);
    passwordUser !== req.body.password &&
      res.status(401).json({
        status: "error",
        message: "Wrong Credentials. Password Doesn't match",
      });

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    user.password = undefined;
    res.json({
      status: "success",
      message: { ...user._doc, accessToken },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
