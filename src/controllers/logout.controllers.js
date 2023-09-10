import express from "express";
import prisma from "../utils/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;

  const userId = data.user;

  try {
    // Update the refreshToken field to null for the user with the given userId
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    } else {
      // Respond with a success message
      return res.status(200).json({ message: "Logout successful" });
    }
  } catch (error) {
    console.error("Error while logging out:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
