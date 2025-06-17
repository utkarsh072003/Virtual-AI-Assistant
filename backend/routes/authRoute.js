import express from "express"
import { Login, LogOut, signup } from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.post("/signup",signup);
authRouter.post("/signin",Login);
authRouter.get("/logout",LogOut)

export default authRouter