import express from "express";

const router = express.Router();

router.post("/", (req, res, next) => {
  try {
    res.send("HElo");
  } catch (error) {
    next(error);
  }
});

router.get("/", (req, res, next) => {
  try {
    res.send("Success");
  } catch (error) {
    next(error);
  }
});

export default router;
