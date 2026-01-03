import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js"; // ✅ import multer
import {
  getCurrentUser,
  updateAssistant,
  askToAssistant,
} from "../controllers/user.controller.js"; // ✅ import controller

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);

userRouter.post(
  "/update-assistant",
  isAuth,
  upload.single("image"), // ✅ matches frontend
  updateAssistant
);

userRouter.post("/assistant", isAuth, askToAssistant);

export default userRouter;
