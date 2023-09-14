import express from "express";

const router = express.Router();

import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorisation,
} from "../utilis/verifyToken.js";
import CryptoJs from "crypto-js";
import Order from "../model/Order.js";

router.post("/", verifyToken, async (req, res, next) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json({
      status: "success",
      message: savedOrder,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const _id = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

// Delete

router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Product Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// get single user orders

router.get(
  "/find/:userId",
  verifyTokenAndAuthorisation,
  async (req, res, next) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });

      res.status(200).json({
        status: "success",
        message: cart,
      });
    } catch (error) {
      next(error);
    }
  }
);

// get all Users

router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      status: "success",
      message: orders,
    });
  } catch (error) {
    next(error);
  }
});

// Get monthly income

router.get("/income", verifyTokenAndAdmin, async (req, res, next) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: previousMonth } },
      },
      {
        $project: { month: { $month: "$createdAt" }, sales: "$amount" },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      message: income,
    });
  } catch (error) {
    console.log(error);
    // next(error);
  }
});

export default router;
