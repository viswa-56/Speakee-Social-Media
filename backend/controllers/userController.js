import { User } from "../models/usermodel.js";
import { Trycatch } from "../utils/trycatch.js";
import cloudinary from "cloudinary"
import getDatauri from "../utils/urigenerator.js";
import bcrypt from "bcrypt"

export const myprofile = Trycatch(async(req,res)=>{
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
})

export const userProfile = Trycatch(async(req,res)=>{
    const user = await User.findById(req.params.id).select("-password");

    if (!user){
        return res.status(404).json({
            message:"No user with this Id"
        })
    }
    res.json(user);
})

export const userFollowUnfollow = Trycatch(async(req,res)=>{
    const user = await User.findById(req.params.id)
    const loggedInuser = await User.findById(req.user._id)

    if (!user){
        return res.status(404).json({
            message:"No user with this Id"
        })
    }

    if(user._id.toString() === loggedInuser._id.toString()){
        return res.status(404).json({
            message:"you can't follow yourself"
        }) 
    }

    if (user.followers.includes(loggedInuser._id)){
        const indexfollowing = loggedInuser.followings.indexOf(user._id);
        const indexfollower = user.followings.indexOf(loggedInuser._id);

        loggedInuser.followings.splice(indexfollowing,1);
        user.followers.splice(indexfollower,1);

        await loggedInuser.save()
        await user.save();

        res.json({
            message:"User Unfollowed"
        })
    }
    else{
        loggedInuser.followings.push(user._id);
        user.followers.push(loggedInuser._id);

        await loggedInuser.save()
        await user.save();

        res.json({
            message:"User Followed"
        })
    }
})

export const userFollowerandFollowingsData = Trycatch(async(req,res)=>{
    const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers","-password")
    .populate("followings","-password");
    const followers = user.followers
    const followings = user.followings
    res.json({
        followers,
        followings,
    })
})


export const updateProfile = Trycatch(async(req,res)=>{
    const user = await User.findById(req.user._id)
    // console.log(req.body)
    const {name} = req.body
    // console.log(user)
    if (name){
        user.name  = name
    }

    const file = req.file;
    console.log(file)
    if (file){
        const fileurl = getDatauri(file)

        await cloudinary.v2.uploader.destroy(user.profilePic.id);

        const mycloud = await cloudinary.v2.uploader.upload(fileurl.content)

        user.profilePic.id = mycloud.public_id;
        user.profilePic.url = mycloud.secure_url;
    }
    await user.save()
    res.json({
        message :"profile updated",
    })
})

export const updatePassword = Trycatch(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    const { oldPassword, newPassword } = req.body;
  
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
  
    if (!comparePassword)
      return res.status(400).json({
        message: "Wrong old password",
      });
  
    user.password = await bcrypt.hash(newPassword, 10);
  
    await user.save();
  
    res.json({
      message: "Password Updated",
    });
  });


export const getAllUsers = Trycatch(async(req,res)=>{
    const search = req.query.search || ""
    const users = await User.find({
        name :{$regex : search,
        $options : "i",
        },
        _id : {$ne : req.user._id},
    }).select("-password");

    res.json(users);
})