import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
})

const userSocketMap = {};
const groupSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

export const getGroupMembersSocketIds = (groupId) => {
    return groupSocketMap[groupId] || [];
};

io.on("connection", (socket) => {
    console.log("User connnected", socket.id)

    const userId = socket.handshake.query.userId;

    if (userId != "undefined") userSocketMap[userId] = socket.id

    io.emit("getOnlineUser", Object.keys(userSocketMap));

    // Join group chat
    socket.on("joinGroup", (groupId) => {
        if (!groupSocketMap[groupId]) {
            groupSocketMap[groupId] = [];
        }
        if (!groupSocketMap[groupId].includes(socket.id)) {
            groupSocketMap[groupId].push(socket.id);
        }
        socket.join(groupId);
        console.log(`User ${socket.id} joined group ${groupId}`);
    });

    // Leave group chat
    socket.on("leaveGroup", (groupId) => {
        if (groupSocketMap[groupId]) {  // Check if the group exists
            groupSocketMap[groupId] = groupSocketMap[groupId].filter(
                (id) => id !== socket.id
            );
            socket.leave(groupId);
            console.log(`User ${socket.id} left group ${groupId}`);

            // If no users remain in the group, remove it from the map
            if (groupSocketMap[groupId].length === 0) {
                delete groupSocketMap[groupId];
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected")
        delete userSocketMap[userId]
        for (const groupId in groupSocketMap) {
            groupSocketMap[groupId] = groupSocketMap[groupId].filter(
                (id) => id !== socket.id
            );
        }
        io.emit('getOnlineUser', Object.keys(userSocketMap))
    })
})

export { io, server, app }