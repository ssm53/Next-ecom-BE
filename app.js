import express from "express";
import cors from "cors"; // Import the cors middleware
import userRouter from "./src/controllers/users.controllers.js";
import authRouter from "./src/controllers/auth.controllers.js";

// import sgMail from "@sendgrid/mail";

const app = express();
app.use(cors()); // Use the cors middleware to allow cross-origin requests
app.use(express.json()); // Add this middleware to parse JSON in request bodies
app.use("/users", userRouter);
app.use("/auth", authRouter);

// // send grid code
// // const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const msg = {
//   to: "goanbeachboy@gmail.com", // Change to your recipient
//   from: "shaunshanil95@gmail.com", // Change to your verified sender
//   subject: "Sending with SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };

// sgMail
//   .send(msg)
//   .then((response) => {
//     console.log(response[0].statusCode);
//     console.log(response[0].headers);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

export default app;
