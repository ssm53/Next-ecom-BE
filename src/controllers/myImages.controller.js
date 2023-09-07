import express from "express";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { filter } from "../utils/common.js";

const router = express.Router();

// Define a new route to get images by user ID
router.get("/", async (req, res) => {
  // const userId = parseInt(req.params.userId); // Parse userId from the URL parameter
  const userId = req.params;

  try {
    // Use Prisma to find images owned by the specified user
    const myImages = await prisma.image.findMany({
      where: {
        ownerID: userId,
      },
    });

    // Return the images as JSON response
    return res.json({ myImages, user: userId }); // added user: for redirect
  } catch (error) {
    // Handle errors and return an error response if needed
    console.error("Error retrieving images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
