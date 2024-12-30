import { User } from "../models/usermodel.js";
import getDatauri from "../utils/urigenerator.js";
import bcrypt from "bcrypt"
import cloudinary from "cloudinary"
import generateToken from "../utils/generatetoken.js";
import { Trycatch } from "../utils/trycatch.js";

export const userRegister = Trycatch(async(req,res)=>{
        const { name, email, password, gender } = req.body;
        const file  = req.file;

        if (!name || !email || !password || !gender){
            return res.status(400).json({
                message:"please fill all the values"
            });
        }
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                message:"user with the email alredy exists"
            });
        }
        const fileurl = getDatauri(file);

        const hashpassword = await bcrypt.hash(password,10); 

        const mycloud = await cloudinary.v2.uploader.upload(fileurl.content)
    
        user = await User.create({
            name,
            email,
            password:hashpassword,
            gender,
            profilePic:{
                id:mycloud.public_id,
                url:mycloud.secure_url,
            },
        })

        generateToken(user._id,res);
        res.status(201).json({
            message:"user successfully created",
            user,
        })
})

export const userLogin = Trycatch(async(req,res)=>{
    // console.log("Request Body:", req.body);

    const { email , password } = req.body;

    const user =  await User.findOne({email})

    if (!user){
        return res.status(400).json({
            message:"Invalid credentials"
        });
    }

    const comparepassword = await bcrypt.compare(password,user.password);
    if (!comparepassword) {
        return res.status(400).json({
            message:"Invalid credentials"
        });
    }
    generateToken(user._id,res)

    res.json({
        message:"User logged in",
        user,
    })
})

export const userLogout = Trycatch((req,res)=>{
    res.cookie("token", "",{maxAge:0})

    res.json({
        message:"Logged out successfully"
    })
})