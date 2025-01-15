import { Story } from "../models/storymodel.js";
import { Trycatch } from "../utils/trycatch.js";
import getDatauri from "../utils/urigenerator.js";
import cloudinary from "cloudinary";

// Add a new story
export const newStory = Trycatch(async (req, res) => {
  const ownerId = req.user._id; // Assuming req.user is set by authentication middleware
  // console.log(req)
  const file = req.file; // File uploaded from the client
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = getDatauri(file); // Generate a data URI from the uploaded file

  const type = req.query.type; // Story type: image or reel
  const options = type === "reel" 
    ? { resource_type: "video" } 
    : {}; // Default is for images

  // Upload to Cloudinary
  const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, options);

  // Create a new story in the database
  const story = await Story.create({
    story: {
      id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    owner: ownerId,
    ownerProfilePic :req.user.profilePic.url, 
    ownerName : req.user.name,
    type: type || "image", // Default type is "image"
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24-hour expiration
  });

  res.status(201).json({
    message: "Story created successfully",
    story,
  });
});

// export const newStory = Trycatch(async (req, res) => {
//   const ownerId = req.user._id; // Assuming req.user is set by authentication middleware
//   // console.log(req)
//   const file = req.file; // File uploaded from the client
//   if (!file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   const fileUrl = getDatauri(file); // Generate a data URI from the uploaded file

//   const type = req.query.type; // Story type: image or reel
//   const options = type === "reel" 
//     ? { resource_type: "video" } 
//     : {}; // Default is for images

//   // Upload to Cloudinary
//   const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, options);


//   const newStoryObj = {
//     story: {
//       id: myCloud.public_id,
//       url: myCloud.secure_url,
//     },
//     type: type || "image", // Default type is "image"
//     createdAt: Date.now(),
//     expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24-hour expiration
//   };
//   const user = await Story.findOne({ owner: ownerId });
//   // Create a new story in the database
//   if (!user) {
//     // If the user doesn't have any existing stories, create a new document with the first story
//     await Story.create({
//       owner: ownerId,
//       ownerProfilePic: req.user.profilePic.url,
//       ownerName: req.user.name,
//       stories: [newStoryObj] // Store the story in the `stories` array
//     });
//   } else {
//     // If the user exists, just push the new story into the stories array
//     user.stories.push(newStoryObj);
//     await user.save(); // Save the updated document
//   }

//   res.status(201).json({
//     message: "Story created successfully",
//     newStoryObj,
//   });
// });

// Delete a story

export const deleteStory = Trycatch(async (req, res) => {
  const storyId = req.params.id; // Get story ID from the request parameters

  const story = await Story.findById(storyId);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  // Check if the logged-in user is the owner of the story
  if (story.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Delete from Cloudinary
  await cloudinary.v2.uploader.destroy(story.story.id, {
    resource_type: story.type === "reel" ? "video" : "image",
  });

  // Delete from the database
  await story.deleteOne();

  res.status(200).json({ message: "Story deleted successfully" });
});

// export const getAllStories = Trycatch(async (req, res) => {

//     const stories = await Story.find({ expiresAt: { $gt: new Date() } }) // Fetch stories not yet expired
//       .populate("owner", "username profilePic") // Include owner details (e.g., username, profile picture)
//       .sort({ createdAt: -1 }); // Sort by creation time (newest first)
  
//     res.status(200).json({
//       message: "Active stories fetched successfully",
//       stories,
//     });
//   });


export const getAllStories = Trycatch(async (req, res) => {
  // Fetch all stories that haven't expired, group them by owner
  const stories = await Story.aggregate([
    { 
      $match: { expiresAt: { $gt: new Date() } } // Only active stories
    },
    {
      $group: {
        _id: "$owner", // Group by owner ID
        ownerName: { $first: "$ownerName" }, // Get the owner's name
        ownerProfilePic: { $first: "$ownerProfilePic" }, // Get the owner's profile picture
        stories: {
          $push: {
            storyId: "$_id",
            story: { id: "$story.id", url: "$story.url" },
            type: "$type",
            createdAt: "$createdAt",
            expiresAt: "$expiresAt"
          }
        }
      }
    },
    {
      $sort: { "stories.createdAt": -1 } // Sort stories by creation time (newest first)
    }
  ]);

  res.status(200).json({
    message: "Active stories fetched successfully",
    stories
  });
});
