import express from "express";
import cors from "cors"; // Import the cors middleware
import userRouter from "./src/controllers/users.controllers.js";
import authRouter from "./src/controllers/auth.controllers.js";

const app = express();
app.use(cors()); // Use the cors middleware to allow cross-origin requests
app.use(express.json()); // Add this middleware to parse JSON in request bodies
app.use("/users", userRouter);
app.use("/auth", authRouter);

export default app;
