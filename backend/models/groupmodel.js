import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: {
        text: String,
        sender: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        }
    },
    profilePic: {
        id: String,
        url: String,
      },
    },
    {
        timestamps: true
    }
);

export const GroupChat = mongoose.model('GroupChat', GroupSchema);
