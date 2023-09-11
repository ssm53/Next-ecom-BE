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
    // we should user jwt.verify here, but it doesnt work la!
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

export default router;
