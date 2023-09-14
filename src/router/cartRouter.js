import express from "express";

const router = express.Router();

import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorisation,
} from "../utilis/verifyToken.js";
import CryptoJs from "crypto-js";
import Cart from "../model/Cart.js";

router.post("/", verifyToken, async (req, res, next) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json({
      status: "success",
      message: savedCart,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", verifyTokenAndAuthorisation, async (req, res, next) => {
  try {
    const _id = req.params.id;
    const updatedCart = await Cart.findByIdAndUpdate(
      _id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: updatedCart,
    });
  } catch (error) {
    next(error);
  }
});

// Delete

router.delete("/:id", verifyTokenAndAuthorisation, async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Product Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// get single cart

router.get(
  "/find/:userId",
  verifyTokenAndAuthorisation,
  async (req, res, next) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });

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
    const carts = await Cart.find();

    res.status(200).json({
      status: "success",
      message: carts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
