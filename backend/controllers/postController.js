import { Post } from "../models/postmodel.js";
import { Trycatch } from "../utils/trycatch.js";
import getDatauri from "../utils/urigenerator.js";
import cloudinary from "cloudinary"

export const newPost = Trycatch(async(req,res)=>{
    const {caption} = req.body

    const ownerId = req.user._id

    const file = req.file
    const fileurl = getDatauri(file)
    let option;
    const type = req.query.type
    if (type =="reel"){
        option = {
            resource_type : "video",
        };

    }
    else{
        option = {};
    }
    const mycloud = await cloudinary.v2.uploader.upload(fileurl.content,option);

    const post = await Post.create({
        caption,
        post:{
            id:mycloud.public_id,
            url:mycloud.secure_url
        },
        owner:ownerId,
        type:type,
    })
    res.status(201).json({
        message:"Post Created",
        post
    })
})

export const deletePost = Trycatch(async(req,res)=>{
    const post = await Post.findById(req.params.id);

    if(!post){
        return res.status(404).json({
            message:"No post Found with this Id"
        })
    }

    if(post.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message:"You cant delete this Post as you are not the owner"
        })
    }

    await cloudinary.v2.uploader.destroy(post.id);

    await post.deleteOne();

    res.json({
        message:"Post deleted"
    })
})

export const getAllposts= Trycatch(async(req,res)=>{
    const posts = await Post.find({type:"post"})
    .sort({createdAt:-1})
    .populate("owner","-password")
    .populate({
        path:"comments.user",
        select : "-password"
    });
    const reels = await Post.find({type:"reel"})
    .sort({createdAt:-1})
    .populate("owner","-password")
    .populate({
        path:"comments.user",
        select : "-password"
    });

    res.json({posts,reels})

})

export const likeUnlikePost= Trycatch(async(req,res)=>{
    const post = await Post.findById(req.params.id)

    if(!post) return res.status(404).json({message:"No posts"})
    
    if (post.likes.includes(req.user._id)){
        const index = post.likes.indexOf(req.user._id)

        post.likes.splice(index,1)
        await post.save();

        res.json({
            message:"Post Unliked",
        })
    }
    else{
        post.likes.push(req.user._id);
        await post.save();

        res.json({
            message:"Post liked",
        })
    }
})

export const commentOnPost= Trycatch(async(req,res)=>{
    const post = await Post.findById(req.params.id)

    if(!post) return res.status(404).json({message:"No posts"})
    
    post.comments.push({
        user:req.user._id,
        name : req.user.name,
        comment:req.body.comment,
    })
    await post.save()

    res.json({
        message:"comment added"
    })
    
}) 

export const deleteComment = Trycatch(async(req,res)=>{
    const post = await Post.findById(req.params.id)

    if(!post) return res.status(404).json({message:"No posts"})
    
    if(!req.query.commentId) return res.status(404).json({message:"please provide comment Id"})
    
    const commentIndex = post.comments.findIndex(
        (item)=> item._id.toString() === req.query.commentId.toString()
    )

    if (commentIndex === -1){
        return res.status(400).json({message:"No comment found"})
    }
    
    const comment = post.comments[commentIndex]

    if(
        post.owner.toString() === req.user._id.toString() || 
        comment.user.toString() == req.user._id.toString() 
    ){
        post.comments.splice(commentIndex,1)
        await post.save()

        return res.json({
            message:"comment deleted"
        })
    }
    else{
        return res.status(400).json({
            message:"you are not allowed to delete this comment"
        })
    }

}) 

export const editCaption = Trycatch(async (req, res) => {
    const post = await Post.findById(req.params.id);
  
    if (!post)
      return res.status(404).json({
        message: "No Post with this id",
      });
  
    if (post.owner.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "You are not owner of this post",
      });
  
    post.caption = req.body.caption;
  
    await post.save();
  
    res.json({
      message: "post updated",
    });
  });