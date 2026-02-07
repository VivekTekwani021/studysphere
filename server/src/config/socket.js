const { Server } = require("socket.io");
const StudyRoom = require("../models/StudyRoom.model");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        // Join a study room
        socket.on("join-room", async ({ roomId, userId, userName }) => {
            try {
                socket.join(roomId);
                socket.roomId = roomId;
                socket.userId = userId;
                socket.userName = userName;

                // Notify others in the room
                socket.to(roomId).emit("user-joined", {
                    userId,
                    userName,
                    message: `${userName} joined the room`,
                });

                console.log(`👤 ${userName} joined room ${roomId}`);
            } catch (error) {
                console.error("Join room error:", error);
            }
        });

        // Leave a study room
        socket.on("leave-room", ({ roomId, userName }) => {
            socket.leave(roomId);
            socket.to(roomId).emit("user-left", {
                userId: socket.userId,
                userName,
                message: `${userName} left the room`,
            });
            console.log(`👋 ${userName} left room ${roomId}`);
        });

        // Send a chat message
        socket.on("send-message", async ({ roomId, message, userId, userName }) => {
            try {
                // Save message to database
                const room = await StudyRoom.findById(roomId);
                if (room) {
                    room.messages.push({
                        sender: userId,
                        content: message,
                        timestamp: new Date(),
                    });
                    await room.save();
                }

                // Broadcast to all in room (including sender for confirmation)
                io.to(roomId).emit("new-message", {
                    sender: { _id: userId, name: userName },
                    content: message,
                    timestamp: new Date(),
                });
            } catch (error) {
                console.error("Send message error:", error);
            }
        });

        // Whiteboard drawing events
        socket.on("draw", ({ roomId, drawData }) => {
            socket.to(roomId).emit("draw", drawData);
        });

        // Clear whiteboard
        socket.on("clear-canvas", ({ roomId }) => {
            socket.to(roomId).emit("clear-canvas");
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            if (socket.roomId && socket.userName) {
                socket.to(socket.roomId).emit("user-left", {
                    userId: socket.userId,
                    userName: socket.userName,
                    message: `${socket.userName} disconnected`,
                });
            }
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = { initializeSocket, getIO };
