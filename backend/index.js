import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./database/db.js";
import userroutes from "./routes/userroutes.js"
import authroutes from "./routes/authroutes.js"
import postroutes from "./routes/postroutes.js"
import messageroutes from "./routes/messageroutes.js"
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import { app,server } from "./socket/socket.js";
// import path from "path"

dotenv.config()

cloudinary.v2.config({
    cloud_name:process.env.cloudinary_cloudname,
    api_key:process.env.cloudinary_api,
    api_secret:process.env.cloudinary_secret,
})

// const app = express()

const port = process.env.PORT;

app.get('/',(req,res)=>{
    res.send("server working")
})



//middleware
app.use(express.json())
app.use(cookieParser())
// app.use(express.urlencoded({ extended: true }));
//routes
app.use("/api/user",userroutes);
app.use("/api/post",postroutes);
app.use("/api/auth",authroutes);
app.use("/api/messages",messageroutes);

// const __dirname = path.resolve()

// app.use(express.static(path.join(__dirname,"/frontend/dist")))

// app.get("*",(req,res)=>{
//     res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
// })

server.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
    connectDB();
})

