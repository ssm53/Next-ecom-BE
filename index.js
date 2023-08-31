// - see freecodecamp - https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/
// see this mosh hamedani video

// QUESTIONS
// in lms, it shows data = req.body instead of ours... what's the diff ah?

import express from "express";
import cors from "cors"; // Import the cors middleware
import prisma from "./src/utils/prisma.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors()); // Use the cors middleware to allow cross-origin requests
app.use(express.json()); // Add this middleware to parse JSON in request bodies

app.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

// post request to create new user
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`);
});
