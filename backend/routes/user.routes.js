import express from "express";
import { signUp, Login, signin, logOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signin);
authRouter.post("/logout", logOut);
authRouter.post("/login", Login);

export default authRouter;

