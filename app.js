import express from "express";
import cors from "cors"; // Import the cors middleware
import userRouter from "./src/controllers/users.controllers.js";
import authRouter from "./src/controllers/auth.controllers.js";
import uploadRouter from "./src/controllers/upload.controllers.js";
import allPicsRouter from "./src/controllers/allPics.controllers.js";
import stripeRouter from "./src/controllers/stripe.controllers.js";
import deletePicRouter from "./src/controllers/deletePic.controllers.js";
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
app.use("/deletePic", deletePicRouter);
app.use("/my-images/:userId", myImagesRouter);

export default app;
