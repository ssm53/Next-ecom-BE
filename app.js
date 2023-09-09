import express from "express";
import cors from "cors"; // Import the cors middleware
import prisma from "./src/utils/prisma.js";
import userRouter from "./src/controllers/users.controllers.js";
import authRouter from "./src/controllers/auth.controllers.js";
import uploadRouter from "./src/controllers/upload.controllers.js";
import allPicsRouter from "./src/controllers/allPics.controllers.js";
import stripeRouter from "./src/controllers/stripe.controllers.js";
// import deletePicRouter from "./src/controllers/deletePic.controllers.js";
import authRefreshRouter from "./src/controllers/authRefresh.controllers.js";
import myImagesRouter from "./src/controllers/myImages.controller.js";
import morgan from "morgan";
import auth from "./src/middlewares/auth.js"; // tesing DELETE

const app = express();
app.use(morgan("combined"));
app.use(cors()); // Use the cors middleware to allow cross-origin requests
app.use(express.json()); // Add this middleware to parse JSON in request bodies
app.use("/create-checkout-session", stripeRouter);
app.use("/upload", auth);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/allPics", allPicsRouter);
// app.use("/deletePic/:imageId", deletePicRouter);
app.use("/my-images/:userId", myImagesRouter);
app.use("/check-login", authRefreshRouter);

app.delete("/deletePic/:imageId", auth, async (req, res) => {
  const imageId = parseInt(req.params.imageId);
  // console.log(imageId);
  // console.log(typeof imageId);
  // but this below doesnt work to get userid
  // const userId = req.user.payload.id; // Get the ID of the authenticated user
  // console.log(userId);

  // Use Prisma to find picture, so we can get userId
  const picture = await prisma.image.findUnique({
    where: {
      id: imageId,
    },
  });
  const userId = picture.ownerID;
  console.log(userId);

  try {
    // Find the image by ID and ownerID (to ensure ownership)
    const image = await prisma.image.findUnique({
      where: {
        id: imageId,
        ownerID: userId,
      },
    });

    // console.log(image);

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

export default app;
