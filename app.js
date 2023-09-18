import express from "express";
import cors from "cors"; // Import the cors middleware
import prisma from "./src/utils/prisma.js";
import userRouter from "./src/controllers/users.controllers.js";
import authRouter from "./src/controllers/auth.controllers.js";
import uploadRouter from "./src/controllers/upload.controllers.js";
import allPicsRouter from "./src/controllers/allPics.controllers.js";
import stripeRouter from "./src/controllers/stripe.controllers.js";
// import deletePicRouter from "./src/controllers/deletePic.controllers.js";
// import myImagesRouter from "./src/controllers/myImages.controller.js";
import authRefreshRouter from "./src/controllers/authRefresh.controllers.js";
import logoutRouter from "./src/controllers/logout.controllers.js";
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
// app.use("/my-images/:userId", myImagesRouter);
app.use("/authRefresh", authRefreshRouter);
app.use("/logout", logoutRouter);

// we do deletepic api here is because that's the only we could get imageId to work. This ie because we worked with params here
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

// myImages endpoint
// Define a new route to get images by user ID
app.get("/my-images/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId); // Parse userId from the URL parameter
  // let userId = req.params;
  console.log(userId);
  console.log(typeof userId);

  try {
    // Use Prisma to find images owned by the specified user
    const myImages = await prisma.image.findMany({
      where: {
        ownerID: userId,
      },
    });

    // let userid = myImages[0].ownerID;
    // console.log(userid);

    // Return the images as JSON response
    return res.json({ myImages, userId }); // added user: for redirect.. place change to userid if needed
  } catch (error) {
    // Handle errors and return an error response if needed
    console.error("Error retrieving images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
