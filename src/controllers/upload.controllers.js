// where do I need to import auth
// READ ALL COMMENTS TO FIND ISSUES TO SOLVE

import express from "express";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";
import { filter } from "../utils/common.js";
// import auth from "../middlewares/auth.js"; // do I need to do this
import { validateUpload } from "../validators/upload.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;

  const validationErrors = validateUpload(data);

  if (Object.keys(validationErrors).length != 0)
    return res.status(400).send({
      error: validationErrors,
    });

  // data.password = bcrypt.hashSync(data.password, 8);
  prisma.image // i changed this to image
    .create({
      data: {
        ...data,
        ownerID: req.user.payload.id,
      },
    })
    .then((image) => {
      return res.json(image);
    })
    .catch((err) => {
      // i dont think we need this anymore
      // if (
      //   err instanceof Prisma.PrismaClientKnownRequestError &&
      //   err.code === "P2002"
      // ) {
      //   const formattedError = {};
      //   formattedError[`${err.meta.target[0]}`] = "already taken";

      //   return res.status(500).send({
      //     error: formattedError,
      //   }); // friendly error handling
      // }
      throw err;
    });
});

export default router;
