import React, { useState, useEffect } from 'react';
import { studyRoomApi } from '../../api/studyRoom.api';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import {
    Users,
    Plus,
    ArrowRight,
    Clock,
    Loader2,
    Video,
    X,
    Key,
    Copy,
    Check,
    LogIn,
    Crown,
    Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudyRooms = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showMeetingDetails, setShowMeetingDetails] = useState(null);
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [newRoom, setNewRoom] = useState({ name: '', description: '' });
    const [joinForm, setJoinForm] = useState({ meetingId: '', password: '' });
    const [copiedField, setCopiedField] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await studyRoomApi.getRooms();
            if (response.success) {
                setRooms(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async () => {
        if (!newRoom.name.trim()) {
            toast.error('Room name is required');
            return;
        }

        setCreating(true);
        try {
            const response = await studyRoomApi.createRoom(newRoom);
            if (response.success) {
                toast.success('Room created!');
                setShowCreateModal(false);
                setNewRoom({ name: '', description: '' });
                // Show meeting details to the host
                setShowMeetingDetails({
                    roomId: response.data._id,
                    roomName: response.data.name,
                    meetingId: response.meetingDetails.meetingId,
                    password: response.meetingDetails.password,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create room');
        } finally {
            setCreating(false);
        }
    };

    const handleJoinByMeetingId = async () => {
        if (!joinForm.meetingId.trim() || !joinForm.password.trim()) {
            toast.error('Meeting ID and password are required');
            return;
        }

        setJoining(true);
        try {
            const response = await studyRoomApi.joinByMeetingId(
                joinForm.meetingId.toUpperCase(),
                joinForm.password
            );
            if (response.success) {
                toast.success(response.message || 'Joined room!');
                setShowJoinModal(false);
                setJoinForm({ meetingId: '', password: '' });
                navigate(`/study-rooms/${response.data._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to join room');
        } finally {
            setJoining(false);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            await studyRoomApi.joinRoom(roomId);
            navigate(`/study-rooms/${roomId}`);
        } catch (error) {
            // If already in room, just navigate
            if (error.response?.data?.message?.includes('already')) {
                navigate(`/study-rooms/${roomId}`);
            } else {
                toast.error(error.response?.data?.message || 'Failed to join room');
            }
        }
    };

    const handleCopy = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    const handleGoToRoom = () => {
        if (showMeetingDetails?.roomId) {
            navigate(`/study-rooms/${showMeetingDetails.roomId}`);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isUserHost = (room) => {
        const userId = user?._id || user?.id;
        const hostId = room.host?._id || room.host;
        const creatorId = room.createdBy?._id || room.createdBy;

        return (hostId?.toString() === userId?.toString()) ||
            (creatorId?.toString() === userId?.toString());
    };

    const handleDeleteRoom = async (e, roomId) => {
        e.stopPropagation(); // Prevent card click
        if (!window.confirm('Are you sure you want to permanently delete this room? This action cannot be undone.')) {
            return;
        }
        try {
            await studyRoomApi.deleteRoom(roomId);
            toast.success('Room deleted successfully');
            setRooms(rooms.filter(r => r._id !== roomId));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete room');
        }
    };

    return (
        <div className={clsx("min-h-screen p-6", isDark ? "bg-slate-900" : "bg-slate-50")}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                        <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                            Study Rooms
                        </h1>
                        <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                            Collaborate with peers in real-time
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all border",
                            isDark
                                ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                                : "border-slate-300 text-slate-700 hover:bg-slate-100"
                        )}
                    >
                        <LogIn className="w-5 h-5" />
                        Join with Code
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
                    >
                        <Plus className="w-5 h-5" />
                        Create Room
                    </button>
                </div>
            </div>

            {/* Rooms Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className={clsx("w-8 h-8 animate-spin", isDark ? "text-slate-400" : "text-slate-500")} />
                </div>
            ) : rooms.length === 0 ? (
                <div className={clsx(
                    "text-center py-16 rounded-2xl border border-dashed",
                    isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-300"
                )}>
                    <Video className={clsx("w-16 h-16 mx-auto mb-4 opacity-30", isDark ? "text-slate-400" : "text-slate-400")} />
                    <h3 className={clsx("text-lg font-semibold mb-2", isDark ? "text-white" : "text-slate-900")}>
                        No active rooms
                    </h3>
                    <p className={clsx("text-sm mb-6", isDark ? "text-slate-400" : "text-slate-500")}>
                        Create a room or join with a meeting code
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => setShowJoinModal(true)}
                            className={clsx(
                                "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border",
                                isDark ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-700"
                            )}
                        >
                            <LogIn className="w-5 h-5" />
                            Join with Code
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold"
                        >
                            <Plus className="w-5 h-5" />
                            Create Room
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                        <div
                            key={room._id}
                            className={clsx(
                                "group rounded-2xl border p-6 transition-all hover:shadow-xl cursor-pointer",
                                isDark
                                    ? "bg-slate-800/50 border-slate-700 hover:border-cyan-500/50"
                                    : "bg-white border-slate-200 hover:border-cyan-400"
                            )}
                            onClick={() => handleJoinRoom(room._id)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                                        <Users className="w-5 h-5 text-cyan-500" />
                                    </div>
                                    {isUserHost(room) && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                            <Crown className="w-3 h-3" />
                                            Host
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {isUserHost(room) && (
                                        <button
                                            onClick={(e) => handleDeleteRoom(e, room._id)}
                                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
                                            title="Delete room"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <span className={clsx(
                                        "px-2.5 py-1 rounded-full text-xs font-medium",
                                        room.participants.length >= room.maxParticipants
                                            ? "bg-red-100 text-red-600"
                                            : "bg-emerald-100 text-emerald-600"
                                    )}>
                                        {room.participants.length}/{room.maxParticipants}
                                    </span>
                                </div>
                            </div>

                            <h3 className={clsx("text-lg font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
                                {room.name}
                            </h3>

                            {room.description && (
                                <p className={clsx("text-sm mb-3 line-clamp-2", isDark ? "text-slate-400" : "text-slate-500")}>
                                    {room.description}
                                </p>
                            )}

                            {/* Meeting ID display */}
                            <div className={clsx(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-3",
                                isDark ? "bg-slate-700/50" : "bg-slate-100"
                            )}>
                                <Key className={clsx("w-3.5 h-3.5", isDark ? "text-slate-400" : "text-slate-500")} />
                                <span className={clsx("font-mono", isDark ? "text-slate-300" : "text-slate-600")}>
                                    {room.meetingId}
                                </span>
                            </div>

                            <div className={clsx("flex items-center justify-between text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    Created {formatTime(room.createdAt)}
                                </div>
                                <span className="flex items-center gap-1 text-cyan-500 font-medium group-hover:gap-2 transition-all">
                                    Join <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>

                            {/* Participants avatars */}
                            <div className="flex -space-x-2 mt-4">
                                {room.participants.slice(0, 5).map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-800"
                                        title={p.user?.name}
                                    >
                                        {p.user?.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                ))}
                                {room.participants.length > 5 && (
                                    <div className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2",
                                        isDark ? "bg-slate-700 text-slate-300 border-slate-800" : "bg-slate-100 text-slate-600 border-white"
                                    )}>
                                        +{room.participants.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Join by Code Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={clsx(
                        "w-full max-w-md rounded-2xl p-6",
                        isDark ? "bg-slate-800" : "bg-white"
                    )}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                                    <LogIn className="w-5 h-5 text-white" />
                                </div>
                                <h2 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                                    Join with Code
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowJoinModal(false)}
                                className={clsx("p-2 rounded-lg transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
                            >
                                <X className={clsx("w-5 h-5", isDark ? "text-slate-400" : "text-slate-500")} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                                    Meeting ID
                                </label>
                                <input
                                    type="text"
                                    value={joinForm.meetingId}
                                    onChange={(e) => setJoinForm({ ...joinForm, meetingId: e.target.value.toUpperCase() })}
                                    placeholder="Enter 8-character code"
                                    maxLength={8}
                                    className={clsx(
                                        "w-full px-4 py-3 rounded-xl border outline-none transition-colors font-mono text-center text-lg tracking-widest uppercase",
                                        isDark
                                            ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500"
                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500"
                                    )}
                                />
                            </div>

                            <div>
                                <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                                    Password
                                </label>
                                <input
                                    type="text"
                                    value={joinForm.password}
                                    onChange={(e) => setJoinForm({ ...joinForm, password: e.target.value })}
                                    placeholder="Enter 6-digit password"
                                    maxLength={6}
                                    className={clsx(
                                        "w-full px-4 py-3 rounded-xl border outline-none transition-colors font-mono text-center text-lg tracking-widest",
                                        isDark
                                            ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500"
                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500"
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowJoinModal(false)}
                                className={clsx(
                                    "flex-1 py-3 rounded-xl font-semibold transition-colors",
                                    isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJoinByMeetingId}
                                disabled={joining || !joinForm.meetingId || !joinForm.password}
                                className={clsx(
                                    "flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                                    joining || !joinForm.meetingId || !joinForm.password
                                        ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                                )}
                            >
                                {joining ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    'Join Room'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={clsx(
                        "w-full max-w-md rounded-2xl p-6",
                        isDark ? "bg-slate-800" : "bg-white"
                    )}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                                Create Study Room
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className={clsx("p-2 rounded-lg transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
                            >
                                <X className={clsx("w-5 h-5", isDark ? "text-slate-400" : "text-slate-500")} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                                    Room Name *
                                </label>
                                <input
                                    type="text"
                                    value={newRoom.name}
                                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                    placeholder="e.g., DSA Practice Group"
                                    className={clsx(
                                        "w-full px-4 py-3 rounded-xl border outline-none transition-colors",
                                        isDark
                                            ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500"
                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500"
                                    )}
                                />
                            </div>

                            <div>
                                <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                                    Description (optional)
                                </label>
                                <textarea
                                    value={newRoom.description}
                                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                                    placeholder="What will you study?"
                                    rows={3}
                                    className={clsx(
                                        "w-full px-4 py-3 rounded-xl border outline-none transition-colors resize-none",
                                        isDark
                                            ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500"
                                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500"
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className={clsx(
                                    "flex-1 py-3 rounded-xl font-semibold transition-colors",
                                    isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateRoom}
                                disabled={creating}
                                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Room'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Meeting Details Modal (shown after creating room) */}
            {showMeetingDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={clsx(
                        "w-full max-w-md rounded-2xl p-6",
                        isDark ? "bg-slate-800" : "bg-white"
                    )}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                                <Check className="w-8 h-8 text-white" />
                            </div>
                            <h2 className={clsx("text-xl font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
                                Room Created!
                            </h2>
                            <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                                Share these details with participants
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className={clsx(
                                "p-4 rounded-xl",
                                isDark ? "bg-slate-700/50" : "bg-slate-100"
                            )}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={clsx("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                                        Room Name
                                    </span>
                                </div>
                                <p className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                                    {showMeetingDetails.roomName}
                                </p>
                            </div>

                            <div className={clsx(
                                "p-4 rounded-xl",
                                isDark ? "bg-slate-700/50" : "bg-slate-100"
                            )}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={clsx("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                                        Meeting ID
                                    </span>
                                    <button
                                        onClick={() => handleCopy(showMeetingDetails.meetingId, 'meetingId')}
                                        className={clsx(
                                            "p-1.5 rounded-lg transition-colors",
                                            isDark ? "hover:bg-slate-600" : "hover:bg-slate-200"
                                        )}
                                    >
                                        {copiedField === 'meetingId' ? (
                                            <Check className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <Copy className={clsx("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                                        )}
                                    </button>
                                </div>
                                <p className={clsx("font-mono text-xl tracking-widest", isDark ? "text-white" : "text-slate-900")}>
                                    {showMeetingDetails.meetingId}
                                </p>
                            </div>

                            <div className={clsx(
                                "p-4 rounded-xl",
                                isDark ? "bg-slate-700/50" : "bg-slate-100"
                            )}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={clsx("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                                        Password
                                    </span>
                                    <button
                                        onClick={() => handleCopy(showMeetingDetails.password, 'password')}
                                        className={clsx(
                                            "p-1.5 rounded-lg transition-colors",
                                            isDark ? "hover:bg-slate-600" : "hover:bg-slate-200"
                                        )}
                                    >
                                        {copiedField === 'password' ? (
                                            <Check className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <Copy className={clsx("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                                        )}
                                    </button>
                                </div>
                                <p className={clsx("font-mono text-xl tracking-widest", isDark ? "text-white" : "text-slate-900")}>
                                    {showMeetingDetails.password}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleGoToRoom}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            Enter Room
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyRooms;
