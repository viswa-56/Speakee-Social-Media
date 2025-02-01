// import { text } from "express";
import { Chat } from "../models/chatmodel.js";
import { Messages } from "../models/messagemodel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { Trycatch } from "../utils/trycatch.js";

export const sendMessage = Trycatch(async(req,res)=>{
    const {recieverId,message} = req.body;

    const senderId = req.user._id

    if (!recieverId) return res.status(400).json("please provide recieverId")

    let chat = await Chat.findOne({
        users:{$all :[senderId,recieverId]}
    })

    if(!chat){
        chat = new Chat({
            users :[senderId,recieverId],
            latestMessage:{
                text:message,
                sender:senderId,
            },
        })

        await chat.save();
    }

    const newMessage = new Messages({
        chatId : chat._id,
        sender:senderId,
        text:message,
        senderName:req.user.name,
        chatType:"Chat"
    })

    await newMessage.save()

    await chat.updateOne({
        latestMessage : {
            text :message,
            sender:senderId,
        }
    })

    const receiverSocketId = getReceiverSocketId(recieverId)

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    res.status(201).json(newMessage)
})

export const getAllMessages  = Trycatch(async(req,res)=>{
    const {id} = req.params;
    const userId =  req.user._id;

    const chat =  await Chat.findOne({
        users:{$all:[userId,id]},
    });

    if(!chat){
        return res.status(404).json({
            message:"No chat with these users"
        })
    }
    const messages = await Messages.find({
        chatId:chat._id
    })

    res.json(messages)
})

export const getAllChats = Trycatch(async(req,res)=>{
    const chats = await Chat.find({
        users:req.user._id
    }).populate({
        path:"users",
        select : "name profilePic"
    });

    chats.forEach((e)=>{
        e.users = e.users.filter(
            user => user._id.toString() !== req.user._id.toString()
        )
    })

    res.json(chats);
})
