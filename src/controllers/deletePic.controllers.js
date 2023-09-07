import express from "express";
import prisma from "../utils/prisma.js";
import auth from "../middlewares/auth.js"; // Import the auth middleware to ensure authentication

const router = express.Router();

// Define the delete route
router.delete("/", async (req, res) => {
  const { imageId } = req.params;
  console.log(imageId);
  // const userId = req.user.payload.id; // Get the ID of the authenticated user

  // // Use Prisma to find picture, so we can get userId
  // const picture = await prisma.image.findUnique({
  //   where: {
  //     id: imageId,
  //   },
  // });
  // const userId = picture.ownerID;
  // console.log(userId);

  try {
    // Find the image by ID and ownerID (to ensure ownership)
    const image = await prisma.image.findUnique({
      where: {
        id: +imageId,
        ownerID: userId,
      },
    });

    console.log(image);

    if (!image) {
      // If the image doesn't exist or doesn't belong to the user, return a 404 error
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete the image from the database
    await prisma.image.delete({
      where: {
        id: image.id,
      },
    });

    return res.status(204).send(); // Successful deletion (status 204)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
