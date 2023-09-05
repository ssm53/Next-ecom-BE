import express from "express";
import cors from "cors"; // Import the cors middleware
import userRouter from "./src/controllers/users.controllers.js";
import authRouter from "./src/controllers/auth.controllers.js";
import uploadRouter from "./src/controllers/upload.controllers.js";
import morgan from "morgan";
import auth from "./src/middlewares/auth.js"; // tesing DELETE

const app = express();
app.use(morgan("combined"));
app.use(cors()); // Use the cors middleware to allow cross-origin requests
app.use(express.json()); // Add this middleware to parse JSON in request bodies
app.use("/upload", auth);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

// // DELETE testhing middleware
// app.get("/protected", auth, (req, res) => {
//   res.json({ hello: "world" });
// });
// // DELETE testing finish

export default app;
