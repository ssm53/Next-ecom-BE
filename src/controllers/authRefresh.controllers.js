// const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
import "dotenv/config";
import express from "express";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { validateLogin } from "../validators/auth.js";
import { filter } from "../utils/common.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { verifyRefreshToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("hello1");
  const data = req.body;
  console.log(data);
  const refreshToken = data.refreshToken;
  const userId = parseInt(data.user);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const userFiltered = filter(user, "id", "name", "email");
  const accessToken = await signAccessToken(userFiltered);

  if (!user) {
    console.log("hello2");
    return res
      .status(401)
      .json({ error: "User with the given userId does not exist" });
  } else if (!user.refreshToken) {
    console.log("hello3");
    return res
      .status(401)
      .json({ error: "refreshToken field is null for the user" });
  } else if (user.refreshToken !== refreshToken) {
    console.log("hello4");
    return res
      .status(403)
      .json({ error: "refreshToken does not match the user's refreshToken" });
  } else if (user.refreshToken == refreshToken) {
    return res.json({ accessToken, refreshToken, userId });
  }
});
// try {
//   await verifyRefreshToken(refreshToken);
//   return res.json({ accessToken, refreshToken, userId });
// } catch (error) {
//   console.error(error); // Log the error for debugging
//   return res.status(401).json({ error: "Unauthorized" });
// }

// console.log("hello5");
// console.log(refreshToken);
// console.log(user.refreshToken);
// console.log(typeof refreshToken);
// console.log(typeof user.refreshToken);
// jwt.verify(
//   refreshToken,
//   process.env.REFRESH_TOKEN_SECRET,
//   (err, payload) => {
//     if (err) {
//       return res.status(403).json({ error: "Token verification failed" });
//     } else {
//       console.log("hello6");
//       return res.json({ accessToken, refreshToken, userId });
//     }
//   }
// );

// // original 2
// router.post("/", async (req, res) => {
//   const data = req.body;
//   const refreshToken = data.refreshToken;
//   const userId = parseInt(data.user);

//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   if (!user) {
//     return res
//       .status(401)
//       .json({ error: "User with the given userId does not exist" });
//   } else if (!user.refreshToken) {
//     return res
//       .status(401)
//       .json({ error: "refreshToken field is null for the user" });
//   } else if (user.refreshToken !== refreshToken) {
//     return res
//       .status(403)
//       .json({ error: "refreshToken does not match the user's refreshToken" });
//   }
//   console.log("hello");

//   jwt.verify(refreshToken, refreshTokenSecret, async (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: "Token verification failed" });
//     }

//     console.log("hello2");

//     const userFiltered = filter(user, "id", "name", "email");
//     const accessToken = await signAccessToken(userFiltered);

//     return res.json({ accessToken, refreshToken, userId });
//   });
// });

// // original 1
// router.post("/", async (req, res) => {
//   const data = req.body;
//   const refreshToken = data.refreshToken;
//   const userId = parseInt(data.user); // Convert userId to an integer if it's in string format

//   // here we want to check if the users refreshtoken is null, so for that in our request, we need to send user in te body in our is loggedin function in the frontend. we also need to send the refreshtoken in our body
//   // now next is check if the user's refresh token is not the same as our refreshtoken variable here, we return res.sendstatus(403)

//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   if (!user) {
//     return res.sendStatus(401); // User with the given userId does not exist
//   } else if (!user.refreshToken) {
//     return res.sendStatus(401); // refreshToken field is null for the user
//   } else if (user.refreshToken !== refreshToken) {
//     return res.sendStatus(403); // refreshToken does not match the user's refreshToken
//   }

// jwt.verify(
//   refreshToken,
//   process.env.refreshTokenSecret,
//   async (err, user) => {
//     if (err) return res.sendStatus(403);
//       const userFiltered = filter(user, "id", "name", "email");

//       const accessToken = await signAccessToken(userFiltered);

//       return res.json({ accessToken, refreshToken, userId });
//     }
//   );
// });

export default router;
