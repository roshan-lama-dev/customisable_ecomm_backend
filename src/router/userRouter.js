import express from "express";

const router = express.Router();

router.post("/", (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default router;
