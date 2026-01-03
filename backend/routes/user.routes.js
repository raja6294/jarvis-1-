import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js"; // ✅ import multer
import {
  getCurrentUser,
  updateAssistant,
} from "../controllers/user.controller.js"; // ✅ import controller

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);

userRouter.post(
  "/update-assistant",
  isAuth,
  upload.single("image"), // ✅ matches frontend
  updateAssistant
);

export default userRouter;
