import express from "express";

const router = express.Router();

import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorisation,
} from "../utilis/verifyToken.js";
import CryptoJs from "crypto-js";
import Product from "../model/Product.js";

router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json({
      status: "success",
      message: savedProduct,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", verifyTokenAndAuthorisation, async (req, res, next) => {
  try {
    const _id = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// Delete

router.delete("/:id", verifyTokenAndAuthorisation, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Product Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// get single product

router.get("/find/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      status: "success",
      message: product,
    });
  } catch (error) {
    next(error);
  }
});

// get all Users

router.get("/", async (req, res, next) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json({
      status: "success",
      message: products,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
