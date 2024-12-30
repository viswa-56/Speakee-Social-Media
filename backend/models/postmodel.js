import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    caption:String,

    post :{
        id:String,
        url:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    type:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        name :{
            type:String,
            required:true,
        },
        comment :{
            type:String,
            required:true,
        }
    }]

})

export const Post = mongoose.model("Post",postSchema)