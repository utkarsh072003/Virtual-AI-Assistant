import express from "express"
import { askToAssistant, getCurrentUser, updateAssisatnt } from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();


userRouter.get("/current",isAuth ,getCurrentUser)
userRouter.post("/update",isAuth,upload.single("assistantImage"), updateAssisatnt)
userRouter.post("/asktoassistant", isAuth, askToAssistant)

export default userRouter