const express = require("express");
const router = express.Router();
const studyRoomController = require("../controllers/studyRoom.controller");
const { protect } = require("../middleware/auth.middleware");

// All routes require authentication
router.use(protect);

// POST /api/rooms - Create a new room
router.post("/", studyRoomController.createRoom);

// GET /api/rooms - Get all active rooms
router.get("/", studyRoomController.getRooms);

// GET /api/rooms/my-rooms - Get user's created rooms
router.get("/my-rooms", studyRoomController.getMyRooms);

// POST /api/rooms/join - Join by meeting ID and password
router.post("/join", studyRoomController.joinByMeetingId);

// GET /api/rooms/:id - Get a specific room
router.get("/:id", studyRoomController.getRoom);

// POST /api/rooms/:id/join - Join a room by ID
router.post("/:id/join", studyRoomController.joinRoom);

// POST /api/rooms/:id/leave - Leave a room
router.post("/:id/leave", studyRoomController.leaveRoom);

// POST /api/rooms/:id/transfer-host - Transfer host role
router.post("/:id/transfer-host", studyRoomController.transferHost);

// POST /api/rooms/:id/regenerate-password - Regenerate room password
router.post("/:id/regenerate-password", studyRoomController.regeneratePassword);

// POST /api/rooms/:id/close - Close a room (host only, keeps in DB)
router.post("/:id/close", studyRoomController.closeRoom);

// DELETE /api/rooms/:id - Permanently delete a room (host only)
router.delete("/:id", studyRoomController.deleteRoom);

module.exports = router;

