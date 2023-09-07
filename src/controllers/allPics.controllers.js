import express from "express";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { filter } from "../utils/common.js";
// import { validateUpload } from "../validators/upload.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const allImages = await prisma.image.findMany();

  return res.json({ allImages });
});

export default router;
