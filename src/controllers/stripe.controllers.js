import express from "express";
// const app = express();
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { filter } from "../utils/common.js";

const router = express.Router();

// put api key in .env.dev
const stripe = new Stripe(
  "sk_test_51NnLAPAKnGY6vzrgNETVXXtznJjh7nxMzjLQOXUJJS0wSsfphySF4cdHkgeUhjyf5EcLFoIymS45NAphBxXcTSqr00KXJ6OycN"
);

router.post("/", async (req, res) => {
  const id = req.body;
  const image = await prisma.image.findUnique({
    where: {
      id: id.id,
    },
  });

  const unitAmount = image.price * 100; // Assuming the price is in dollars
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: image.title,
            description: image.description,
            images: [image.url],
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:5173/",
    cancel_url: `http://localhost:5173/failure`,
  });
  return res.json(session.url);
});

export default router;

// router.post("/", async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: req.body.title,
//             description: req.body.description,
//             images: [req.body.url],
//           },
//           unit_amount: req.body.price,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: "http://127.0.0.1:5173/",
//     cancel_url: "http://127.0.0.1:5173/failure",
//   });

//   res.redirect(303, session.url);
// });
