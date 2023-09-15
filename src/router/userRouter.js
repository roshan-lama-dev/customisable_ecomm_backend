import express from "express";
import { verifyToken, verifyTokenAndAdmin } from "../utilis/verifyToken.js";
import CryptoJs from "crypto-js";
import User from "../model/User.js";
const router = express.Router();

router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SECERET
    ).toString();
  }

  try {
    const _id = req.params.id
    const updatedUser = await User.findByIdAndUpdate(
      _id ,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
        status:"success",
        message:updatedUser
    })
  } catch (error) {
    next(error);
  }
});
export default router;
