import express from "express";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorisation,
} from "../utilis/verifyToken.js";
import CryptoJs from "crypto-js";
import User from "../model/User.js";
const router = express.Router();

router.put("/:id", verifyTokenAndAuthorisation, async (req, res, next) => {
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SECERET
    ).toString();
  }

  try {
    const _id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

// Delete

router.delete("/:id", verifyTokenAndAuthorisation, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// get singleUser

router.get("/find/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({
      status: "success",
      message: others,
    });
  } catch (error) {
    next(error);
  }
});

// get all Users

router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
  const query = req.query.new;

  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();

    res.status(200).json({
      status: "success",
      message: users,
    });
  } catch (error) {
    next(error);
  }
});

// get user stats

router.get("/stats", verifyTokenAndAdmin, async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: data,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
