import express from "express"
import dotenv from "dotenv"
dotenv.config();
import ConnectDb from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoutes.js";
import geminiResponse from "./gemini.js";


const app = express();
app.use(cors({
    origin:"https://virtual-ai-assistant-theta.vercel.app",
    credentials:true
}))
app.use(cookieParser())
app.use(express.json());
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)



const port = process.env.PORT || 5000

app.listen(port, ()=>{
    ConnectDb();
    console.log("server started");
    
})
