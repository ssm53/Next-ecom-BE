// Import necessary modules and dependencies
import express from "express";
import jwt from "jsonwebtoken";
const accessTokenSecret = process.env.APP_SECRET;

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded.payload; // Store user information in the request object
    next();
  });
};

// Endpoint to check if the user is logged in
router.get("/", verifyToken, (req, res) => {
  // If the middleware passed, the user is logged in
  res.json({ loggedIn: true });
});

export default router;
