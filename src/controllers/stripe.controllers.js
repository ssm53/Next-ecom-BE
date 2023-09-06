import express from "express";
// const app = express();
import stripe from "stripe";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { filter } from "../utils/common.js";

const router = express.Router();

const stripeInstance = stripe(
  "sk_test_51NnLAPAKnGY6vzrgNETVXXtznJjh7nxMzjLQOXUJJS0wSsfphySF4cdHkgeUhjyf5EcLFoIymS45NAphBxXcTSqr00KXJ6OycN"
);

router.post("/", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://127.0.0.1:5173/",
    cancel_url: "http://127.0.0.1:5173/failure",
  });

  res.redirect(303, session.url);
});

export default router;
