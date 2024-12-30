import jwt from "jsonwebtoken"
import { User } from "../models/usermodel.js"

export const isAuth = async(req,res,next)=>{
    try {
        // console.log("Cookies:", req.cookies);
        const token = req.cookies.token;
        if (!token) return res.status(403).json({message:"Unauthorized"})
        const decodedata = jwt.verify(token,process.env.JWT_SECRET)
        if (!decodedata){
            return res.status(400).json({
                message:"Token expired"
            })
        }    
        req.user = await User.findById(decodedata.id);
        next();
    } catch (error) {
        res.status(500).json({
            message:"please login"
        })
    }
}