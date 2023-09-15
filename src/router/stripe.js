import express from "express";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/payment", (req, res, next) => {
  try {
    stripe.charges.create(
      {
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "aud",
      },
      (stripeErr, stripeRes) => {
        if (stripeErr) {
          res.status(500).json({
            status: "error",
            message: stripeErr,
          });
        } else {
          res.status(200).json({
            status: "success",
            message: stripeRes,
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
});
export default router;
