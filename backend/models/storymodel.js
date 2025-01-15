import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerProfilePic : {
    type:String,
    required:true
  },
  ownerName : {type:String,required:true},
  story :{
    id:String,
    url:String
    },
    type:{
        type:String,
        required:true
    },
    createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 }, // 24 hours
});


// const storySchema = new mongoose.Schema({
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   ownerProfilePic: { type: String, required: true },
//   ownerName: { type: String, required: true },
//   stories: [{
//     story: {
//       id: String,
//       url: String
//     },
//     type: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//     expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 } // 24 hours
//   }]
// });

export const Story = mongoose.model("Story", storySchema);
