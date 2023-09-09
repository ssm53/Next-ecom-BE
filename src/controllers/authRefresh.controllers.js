import express from "express";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { validateLogin } from "../validators/auth.js";
import { filter } from "../utils/common.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { verifyRefreshToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/authRefresh", async (req, res) => {
  const data = req.body;
  const refreshToken = data.refreshToken;
  const userId = parseInt(data.user); // Convert userId to an integer if it's in string format

  // here we want to check if the users refreshtoken is null, so for that in our request, we need to send user in te body in our is loggedin function in the frontend. we also need to send the refreshtoken in our body
  // now next is check if the user's refresh token is not the same as our refreshtoken variable here, we return res.sendstatus(403)

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.sendStatus(401); // User with the given userId does not exist
  } else if (!user.refreshToken) {
    return res.sendStatus(401); // refreshToken field is null for the user
  } else if (user.refreshToken !== refreshToken) {
    return res.sendStatus(403); // refreshToken does not match the user's refreshToken
  }

  const verification = await verifyRefreshToken();

  // if all pass, then we verify our refreshtoken
});
