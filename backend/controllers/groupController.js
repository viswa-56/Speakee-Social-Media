import { GroupChat } from "../models/groupmodel.js";
import { Messages } from "../models/messagemodel.js";
import { getGroupMembersSocketIds, io ,getReceiverSocketId} from "../socket/socket.js";
import { Trycatch } from "../utils/trycatch.js";
import mongoose from 'mongoose';
import getDatauri from "../utils/urigenerator.js";
import cloudinary from "cloudinary"

export const createGroup = Trycatch(async (req, res) => {
  const { name } = req.body;
  const admin = req.user._id;
  const file  = req.file;

  let members;
  try {
    members = JSON.parse(req.body.members);
  } catch (error) {
    return res.status(400).json("Invalid members format.");
  }

  if (!name || !members || members.length === 0) {
    return res.status(400).json("Group name and members are required.");
  }
  
  if (!members.includes(admin.toString())) {
    members.push(admin.toString());
  }

  const fileurl = getDatauri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileurl.content)
  // Convert string representations of ObjectIds to actual ObjectId instances
  const memberIds = members.map(member => new mongoose.Types.ObjectId(member)); // No 'new' needed here

  const group = new GroupChat({
    name,
    members: memberIds,
    latestMessage: null,
    admins:admin,
    profilePic:{
      id:mycloud.public_id,
      url:mycloud.secure_url,
  }
  });

  await group.save();

  const defaultMessage = {
    sender: admin,
    text: `${name} group is created.`,
  };

  // Update the latest message field with the default message
  group.latestMessage = defaultMessage;

  await group.save();

  memberIds.forEach((memberId) => {
    io.to(getReceiverSocketId(memberId)).emit("joinGroup", group._id);
  });
  res.status(201).json(group);
});


// Send message in group
export const sendGroupMessage = Trycatch(async (req, res) => {
  const { groupId, message } = req.body;
  const senderId = req.user._id;

  if (!groupId || !message) {
    return res.status(400).json("Group ID and message are required.");
  }

  const group = await GroupChat.findById(groupId);

  if (!group) {
    return res.status(404).json("Group not found.");
  }

  const newMessage = new Messages({
    chatId: groupId,
    sender: senderId,
    text: message,
    chatType:'GroupChat',
    senderName:req.user.name
  });

  await newMessage.save();

  group.latestMessage = {
    text: message,
    sender: senderId,
  };
  await group.save();

  const memberSocketIds = getGroupMembersSocketIds(groupId);
  memberSocketIds.forEach((socketId) => {
    io.to(socketId).emit("newGroupMessage", newMessage);
  });

  res.status(201).json(newMessage);
});

// Get all messages in a group
export const getGroupMessages = Trycatch(async (req, res) => {
  const { id } = req.params;
  // console.log(id)
  const messages = await Messages.find({ chatId: id });

  res.status(200).json(messages);
});

// Get all groups for the user
export const getUserGroups = Trycatch(async (req, res) => {
  const userId = req.user._id;
  // console.log(userId)

  const groups = await GroupChat.find({
    members: userId,
  }).populate({
    path: "members",
    select: "name profilePic",
  });

  res.status(200).json(groups);
});


// Add member to a group
export const addMemberToGroup = Trycatch(async (req, res) => {
  const { groupId, memberId } = req.body;
  const adminId = req.user._id; // The user sending the request is assumed to be an admin

  const group = await GroupChat.findById(groupId);
  if (!group) {
    return res.status(404).json("Group not found.");
  }

  // Check if the user making the request is an admin
  if (!group.admins.includes(adminId)) {
    return res.status(403).json("You must be an admin to add members.");
  }

  // Add the member if they are not already in the group
  if (group.members.includes(memberId)) {
    return res.status(400).json("This user is already a member.");
  }

  group.members.push(memberId);
  await group.save();
  io.to(getReceiverSocketId(memberId)).emit("joinGroup", groupId);
  res.status(200).json("Member added successfully.");
});


// Remove member from a group
export const removeMemberFromGroup = Trycatch(async (req, res) => {
  const { groupId, memberId } = req.body;
  const adminId = req.user._id;

  const group = await GroupChat.findById(groupId);
  if (!group) {
    return res.status(404).json("Group not found.");
  }

  // Check if the user making the request is an admin
  if (!group.admins.includes(adminId)) {
    return res.status(403).json("You must be an admin to remove members.");
  }

  // Check if the member to remove is in the group
  if (!group.members.includes(memberId)) {
    return res.status(400).json("This user is not a member of the group.");
  }

  // Remove the member
  group.members = group.members.filter(member => member.toString() !== memberId.toString());
  if (group.admins.includes(memberId)) {
    group.admins = group.admins.filter(member => member.toString() !== memberId.toString());
  }
  await group.save();
  io.to(getReceiverSocketId(memberId)).emit("leaveGroup", groupId);
  res.status(200).json("Member removed successfully.");
});


// Exit group
export const exitGroup = Trycatch(async (req, res) => {
  const { groupId } = req.body;
  const userId = req.user._id;

  const group = await GroupChat.findById(groupId);
  if (!group) {
    return res.status(404).json("Group not found.");
  }

  // Check if the user is part of the group
  if (!group.members.includes(userId)) {
    return res.status(400).json("You are not a member of this group.");
  }

  // Remove the user from the members list
  group.members = group.members.filter(member => member.toString() !== userId.toString());
  if (group.admins.includes(userId)) {
    group.admins = group.admins.filter(member => member.toString() !== userId.toString());
  }

  // If there are no admins left, make all remaining members admins
  if (group.admins.length === 0 && group.members.length > 0) {
    group.admins = [...group.members]; // Make all members admins
  }

  await group.save();
  io.to(getReceiverSocketId(userId)).emit("leaveGroup", groupId);
  res.status(200).json("You have successfully exited the group.");
});



// Add admin to the group
export const addAdminToGroup = Trycatch(async (req, res) => {
  const { groupId, newAdminId } = req.body;
  const adminId = req.user._id;

  const group = await GroupChat.findById(groupId);
  if (!group) {
    return res.status(404).json("Group not found.");
  }

  // Check if the user making the request is an admin
  if (!group.admins.includes(adminId)) {
    return res.status(403).json("You must be an admin to add admins.");
  }

  // Check if the user is already an admin
  if (group.admins.includes(newAdminId)) {
    return res.status(400).json("This user is already an admin.");
  }

  // Add the new admin
  group.admins.push(newAdminId);
  await group.save();

  res.status(200).json("Admin added successfully.");
});

// Get all members of a group
export const getAllGroupMembers = Trycatch(async (req, res) => {
  const { groupId } = req.params; // Getting groupId from the route parameters

  const group = await GroupChat.findById(groupId)
    .populate({
      path: "members",
      select: "name profilePic", // Populate member details
    })
    .populate({
      path: "admins",
      select: "_id", // Fetch admin IDs to check membership
    });

  if (!group) {
    return res.status(404).json("Group not found.");
  }

  // Prepare response with isAdmin field
  const membersWithAdminInfo = group.members.map((member) => ({
    _id: member._id,
    name: member.name,
    profilePic: member.profilePic,
    isAdmin: group.admins.some((admin) => admin._id.toString() === member._id.toString()), // Check if member is an admin
  }));

  res.status(200).json(membersWithAdminInfo); // Send the updated member list
});

