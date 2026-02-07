const StudyRoom = require("../models/StudyRoom.model");

/**
 * Create a new study room (user becomes host)
 */
exports.createRoom = async (req, res) => {
    try {
        const { name, description, maxParticipants } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Room name is required" });
        }

        const room = await StudyRoom.create({
            name: name.trim(),
            description: description || "",
            createdBy: req.user._id,
            host: req.user._id,
            maxParticipants: maxParticipants || 10,
            participants: [{ user: req.user._id, role: 'host' }],
        });

        await room.populate("createdBy", "name email");
        await room.populate("host", "name email");
        await room.populate("participants.user", "name email");

        res.status(201).json({
            success: true,
            data: room,
            meetingDetails: {
                meetingId: room.meetingId,
                password: room.password,
            }
        });
    } catch (error) {
        console.error("Create Room Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all active study rooms (public rooms list)
 */
exports.getRooms = async (req, res) => {
    try {
        const rooms = await StudyRoom.find({ isActive: true })
            .populate("createdBy", "name email")
            .populate("host", "name email")
            .populate("participants.user", "name email")
            .select('-password -messages') // Don't expose password in list
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: rooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get user's created rooms (for host dashboard)
 */
exports.getMyRooms = async (req, res) => {
    try {
        const rooms = await StudyRoom.find({
            createdBy: req.user._id,
            isActive: true
        })
            .populate("participants.user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: rooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get a specific room by ID (for participants already in room)
 */
exports.getRoom = async (req, res) => {
    try {
        const room = await StudyRoom.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("host", "name email")
            .populate("participants.user", "name email")
            .populate("messages.sender", "name email");

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        // Check if user is a participant
        const isParticipant = room.participants.some(
            (p) => p.user._id.toString() === req.user._id.toString()
        );

        // Only return password if user is host or already a participant
        const isHost = room.host._id.toString() === req.user._id.toString();

        const roomData = room.toObject();
        if (!isHost) {
            delete roomData.password;
        }

        res.status(200).json({
            success: true,
            data: roomData,
            isHost,
            isParticipant
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Join a study room using meeting ID and password
 */
exports.joinByMeetingId = async (req, res) => {
    try {
        const { meetingId, password } = req.body;

        if (!meetingId || !password) {
            return res.status(400).json({
                success: false,
                message: "Meeting ID and password are required"
            });
        }

        const room = await StudyRoom.findByMeetingId(meetingId.toUpperCase());

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found. Please check the meeting ID."
            });
        }

        // Verify password
        if (room.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        if (!room.isActive) {
            return res.status(400).json({
                success: false,
                message: "This room has been closed"
            });
        }

        // Check if user is already in the room
        const isAlreadyIn = room.participants.some(
            (p) => p.user.toString() === req.user._id.toString()
        );

        if (isAlreadyIn) {
            // Return room data if already a participant
            await room.populate("participants.user", "name email");
            return res.status(200).json({
                success: true,
                data: room,
                message: "Already in room"
            });
        }

        if (room.participants.length >= room.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: "Room is full"
            });
        }

        // Add user as participant
        room.participants.push({ user: req.user._id, role: 'participant' });
        await room.save();

        await room.populate("createdBy", "name email");
        await room.populate("host", "name email");
        await room.populate("participants.user", "name email");

        res.status(200).json({
            success: true,
            data: room,
            message: "Successfully joined the room"
        });
    } catch (error) {
        console.error("Join by Meeting ID Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Join a study room by room ID (from public list)
 */
exports.joinRoom = async (req, res) => {
    try {
        const room = await StudyRoom.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (!room.isActive) {
            return res.status(400).json({ success: false, message: "Room is no longer active" });
        }

        // Check if user is already in the room
        const isAlreadyIn = room.participants.some(
            (p) => p.user.toString() === req.user._id.toString()
        );

        if (isAlreadyIn) {
            await room.populate("participants.user", "name email");
            return res.status(200).json({
                success: true,
                data: room,
                message: "Already in room"
            });
        }

        if (room.participants.length >= room.maxParticipants) {
            return res.status(400).json({ success: false, message: "Room is full" });
        }

        room.participants.push({ user: req.user._id, role: 'participant' });
        await room.save();

        await room.populate("participants.user", "name email");

        res.status(200).json({ success: true, data: room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Leave a study room
 */
exports.leaveRoom = async (req, res) => {
    try {
        const room = await StudyRoom.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        const isHost = room.host.toString() === req.user._id.toString();

        room.participants = room.participants.filter(
            (p) => p.user.toString() !== req.user._id.toString()
        );

        // If host leaves, transfer to next participant or close room
        if (isHost) {
            if (room.participants.length > 0) {
                // Transfer host to first participant
                room.host = room.participants[0].user;
                room.participants[0].role = 'host';
            } else {
                // No one left, close the room
                room.isActive = false;
                room.closedAt = new Date();
            }
        }

        // If room is empty, close it
        if (room.participants.length === 0) {
            room.isActive = false;
            room.closedAt = new Date();
        }

        await room.save();

        res.status(200).json({ success: true, message: "Left the room" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Close/delete a study room (only host can do this)
 */
exports.closeRoom = async (req, res) => {
    try {
        const room = await StudyRoom.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (room.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the host can close this room"
            });
        }

        room.isActive = false;
        room.closedAt = new Date();
        await room.save();

        res.status(200).json({ success: true, message: "Room closed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Permanently delete a study room (only host can do this)
 */
exports.deleteRoom = async (req, res) => {
    try {
        const room = await StudyRoom.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (room.host.toString() !== req.user._id.toString() &&
            room.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the host can delete this room"
            });
        }

        await StudyRoom.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Room deleted permanently" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Transfer host role to another participant
 */
exports.transferHost = async (req, res) => {
    try {
        const { newHostId } = req.body;
        const room = await StudyRoom.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (room.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the current host can transfer host role"
            });
        }

        // Check if new host is a participant
        const participantIndex = room.participants.findIndex(
            (p) => p.user.toString() === newHostId
        );

        if (participantIndex === -1) {
            return res.status(400).json({
                success: false,
                message: "User is not a participant in this room"
            });
        }

        // Update roles
        const currentHostIndex = room.participants.findIndex(
            (p) => p.user.toString() === req.user._id.toString()
        );

        if (currentHostIndex !== -1) {
            room.participants[currentHostIndex].role = 'participant';
        }
        room.participants[participantIndex].role = 'host';
        room.host = newHostId;

        await room.save();
        await room.populate("host", "name email");
        await room.populate("participants.user", "name email");

        res.status(200).json({
            success: true,
            message: "Host role transferred",
            data: room
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Regenerate room password (host only)
 */
exports.regeneratePassword = async (req, res) => {
    try {
        const room = await StudyRoom.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        if (room.host.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the host can regenerate the password"
            });
        }

        // Generate new password
        room.password = Math.floor(100000 + Math.random() * 900000).toString();
        await room.save();

        res.status(200).json({
            success: true,
            message: "Password regenerated",
            password: room.password
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
