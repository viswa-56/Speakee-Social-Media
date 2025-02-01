import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    // chatId : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref:"Chat",

    // },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'chatType', // Use `refPath` to dynamically determine the referenced model
      },
      chatType: {
        type: String,
        enum: ['Chat', 'GroupChat'],  // Possible values for the reference
        required: true,
    },
    sender:{type : mongoose.Schema.Types.ObjectId,
        ref:"User"},
        senderName:String,
        text:String,
    },
    {
        timestamps : true,
    }
)

export const Messages = mongoose.model("Messages",messageSchema)