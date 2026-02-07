import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studyRoomApi } from '../../api/studyRoom.api';
import { useSocket } from '../../hooks/useSocket';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import {
    ArrowLeft,
    Users,
    Send,
    Loader2,
    Trash2,
    LogOut,
    Circle,
    MessageSquare,
    Pencil,
    Key,
    Copy,
    Check,
    Crown,
    RefreshCw,
    Settings,
    X,
    UserMinus
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudyRoomView = () => {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { user } = useAuth();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messageInput, setMessageInput] = useState('');
    const [activeTab, setActiveTab] = useState('chat');
    const [showSettings, setShowSettings] = useState(false);
    const [copiedField, setCopiedField] = useState(null);
    const [isHost, setIsHost] = useState(false);

    const messagesEndRef = useRef(null);
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const {
        isConnected,
        messages,
        setMessages,
        participants,
        setParticipants,
        sendMessage,
        emitDraw,
        clearCanvas,
        onDraw,
        onClearCanvas,
    } = useSocket(roomId, user?._id, user?.name);

    useEffect(() => {
        fetchRoom();
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (canvasRef.current && activeTab === 'whiteboard') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            ctx.strokeStyle = isDark ? '#60a5fa' : '#3b82f6';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            onDraw((drawData) => {
                ctx.beginPath();
                ctx.moveTo(drawData.fromX, drawData.fromY);
                ctx.lineTo(drawData.toX, drawData.toY);
                ctx.stroke();
            });

            onClearCanvas(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        }
    }, [activeTab, isDark]);

    const fetchRoom = async () => {
        try {
            const response = await studyRoomApi.getRoom(roomId);
            if (response.success) {
                setRoom(response.data);

                // Robust host check
                const userId = user?._id || user?.id;
                const hostId = response.data.host?._id || response.data.host;
                const creatorId = response.data.createdBy?._id || response.data.createdBy;
                const isUserHost = (hostId?.toString() === userId?.toString()) ||
                    (creatorId?.toString() === userId?.toString());

                setIsHost(isUserHost);

                setMessages(response.data.messages || []);
                setParticipants(response.data.participants.map(p => ({
                    ...p.user,
                    role: p.role
                })) || []);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load room');
            navigate('/study-rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim()) {
            sendMessage(messageInput);
            setMessageInput('');
        }
    };

    const handleLeaveRoom = async () => {
        try {
            await studyRoomApi.leaveRoom(roomId);
            toast.success('Left the room');
            navigate('/study-rooms');
        } catch (error) {
            console.error(error);
            navigate('/study-rooms');
        }
    };

    const handleCloseRoom = async () => {
        if (!window.confirm('Are you sure you want to close this room? All participants will be removed.')) return;
        try {
            await studyRoomApi.closeRoom(roomId);
            toast.success('Room closed');
            navigate('/study-rooms');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to close room');
        }
    };

    const handleRegeneratePassword = async () => {
        try {
            const response = await studyRoomApi.regeneratePassword(roomId);
            if (response.success) {
                setRoom(prev => ({ ...prev, password: response.password }));
                toast.success('Password regenerated!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to regenerate password');
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

    const startDrawing = (e) => {
        if (activeTab !== 'whiteboard') return;
        isDrawing.current = true;
        const rect = canvasRef.current.getBoundingClientRect();
        lastPos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const draw = (e) => {
        if (!isDrawing.current || activeTab !== 'whiteboard') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const currentPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();

        emitDraw({
            fromX: lastPos.current.x,
            fromY: lastPos.current.y,
            toX: currentPos.x,
            toY: currentPos.y,
        });

        lastPos.current = currentPos;
    };

    const stopDrawing = () => {
        isDrawing.current = false;
    };

    const handleClearCanvas = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        clearCanvas();
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getParticipantRole = (participantId) => {
        const participant = room?.participants?.find(p => p.user?._id === participantId);
        return participant?.role || 'participant';
    };

    if (loading) {
        return (
            <div className={clsx("min-h-screen flex items-center justify-center", isDark ? "bg-slate-900" : "bg-slate-50")}>
                <Loader2 className={clsx("w-8 h-8 animate-spin", isDark ? "text-slate-400" : "text-slate-500")} />
            </div>
        );
    }

    return (
        <div className={clsx("min-h-screen flex flex-col", isDark ? "bg-slate-900" : "bg-slate-50")}>
            {/* Header */}
            <div className={clsx(
                "flex items-center justify-between px-6 py-4 border-b",
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/study-rooms')}
                        className={clsx(
                            "p-2 rounded-lg transition-colors",
                            isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                        )}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className={clsx("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>
                                {room?.name}
                            </h1>
                            {isHost && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                    <Crown className="w-3 h-3" />
                                    Host
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Circle className={clsx("w-2 h-2 fill-current", isConnected ? "text-emerald-500" : "text-red-500")} />
                            <span className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                                {isConnected ? 'Connected' : 'Connecting...'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Meeting Info (for host) */}
                    {isHost && (
                        <button
                            onClick={() => setShowSettings(true)}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors",
                                isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            <Settings className="w-4 h-4" />
                            Meeting Info
                        </button>
                    )}

                    {/* Participants count */}
                    <div className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                        isDark ? "bg-slate-700" : "bg-slate-100"
                    )}>
                        <Users className={clsx("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                        <span className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                            {participants.length}
                        </span>
                    </div>

                    {/* Leave button */}
                    <button
                        onClick={handleLeaveRoom}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                            isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                    >
                        <LogOut className="w-4 h-4" />
                        Leave
                    </button>

                    {/* Close room (host only) */}
                    {isHost && (
                        <button
                            onClick={handleCloseRoom}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Close Room
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Participants */}
                <div className={clsx(
                    "w-64 border-r flex flex-col",
                    isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                )}>
                    <div className={clsx("px-4 py-3 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                        <h3 className={clsx("text-sm font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
                            Participants ({participants.length})
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {participants.map((p, idx) => (
                            <div
                                key={p._id || idx}
                                className={clsx(
                                    "flex items-center gap-3 p-2 rounded-lg",
                                    isDark ? "bg-slate-700/50" : "bg-slate-50"
                                )}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                    {p.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                        <p className={clsx("text-sm font-medium truncate", isDark ? "text-white" : "text-slate-900")}>
                                            {p.name}
                                        </p>
                                        {p.role === 'host' && (
                                            <Crown className="w-3 h-3 text-amber-500" />
                                        )}
                                    </div>
                                    {p._id === user?._id && (
                                        <span className={clsx("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>(You)</span>
                                    )}
                                </div>
                                <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat / Whiteboard Area */}
                <div className="flex-1 flex flex-col">
                    {/* Tabs */}
                    <div className={clsx("flex border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2",
                                activeTab === 'chat'
                                    ? "border-cyan-500 text-cyan-500"
                                    : isDark
                                        ? "border-transparent text-slate-400 hover:text-slate-200"
                                        : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('whiteboard')}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2",
                                activeTab === 'whiteboard'
                                    ? "border-cyan-500 text-cyan-500"
                                    : isDark
                                        ? "border-transparent text-slate-400 hover:text-slate-200"
                                        : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Pencil className="w-4 h-4" />
                            Whiteboard
                        </button>
                    </div>

                    {/* Chat Panel */}
                    {activeTab === 'chat' && (
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={msg.isSystem ? 'text-center' : ''}>
                                        {msg.isSystem ? (
                                            <span className={clsx("text-xs px-3 py-1 rounded-full", isDark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500")}>
                                                {msg.content}
                                            </span>
                                        ) : (
                                            <div className={clsx(
                                                "max-w-[70%] p-3 rounded-2xl",
                                                msg.sender?._id === user?._id
                                                    ? "ml-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md"
                                                    : isDark
                                                        ? "bg-slate-700 text-white rounded-bl-md"
                                                        : "bg-slate-100 text-slate-900 rounded-bl-md"
                                            )}>
                                                {msg.sender?._id !== user?._id && (
                                                    <p className={clsx("text-xs font-medium mb-1", msg.sender?._id === user?._id ? "text-white/80" : isDark ? "text-cyan-400" : "text-cyan-600")}>
                                                        {msg.sender?.name}
                                                    </p>
                                                )}
                                                <p className="text-sm">{msg.content}</p>
                                                <p className={clsx("text-xs mt-1 text-right", msg.sender?._id === user?._id ? "text-white/60" : isDark ? "text-slate-500" : "text-slate-400")}>
                                                    {formatTime(msg.timestamp)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className={clsx("p-4 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className={clsx(
                                            "flex-1 px-4 py-3 rounded-xl border outline-none transition-colors",
                                            isDark
                                                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500"
                                                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500"
                                        )}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Whiteboard Panel */}
                    {activeTab === 'whiteboard' && (
                        <div className="flex-1 flex flex-col p-4">
                            <div className="flex justify-end mb-3">
                                <button
                                    onClick={handleClearCanvas}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                                        isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear
                                </button>
                            </div>
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                className={clsx(
                                    "flex-1 rounded-xl border cursor-crosshair",
                                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Meeting Info Modal (Host only) */}
            {showSettings && isHost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={clsx(
                        "w-full max-w-md rounded-2xl p-6",
                        isDark ? "bg-slate-800" : "bg-white"
                    )}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                                    <Key className="w-5 h-5 text-white" />
                                </div>
                                <h2 className={clsx("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                                    Meeting Details
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowSettings(false)}
                                className={clsx("p-2 rounded-lg transition-colors", isDark ? "hover:bg-slate-700" : "hover:bg-slate-100")}
                            >
                                <X className={clsx("w-5 h-5", isDark ? "text-slate-400" : "text-slate-500")} />
                            </button>
                        </div>

                        <p className={clsx("text-sm mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
                            Share these details with participants to let them join your room.
                        </p>

                        <div className="space-y-4">
                            <div className={clsx(
                                "p-4 rounded-xl",
                                isDark ? "bg-slate-700/50" : "bg-slate-100"
                            )}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={clsx("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>
                                        Meeting ID
                                    </span>
                                    <button
                                        onClick={() => handleCopy(room?.meetingId, 'meetingId')}
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
                                    {room?.meetingId}
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
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={handleRegeneratePassword}
                                            className={clsx(
                                                "p-1.5 rounded-lg transition-colors",
                                                isDark ? "hover:bg-slate-600" : "hover:bg-slate-200"
                                            )}
                                            title="Regenerate password"
                                        >
                                            <RefreshCw className={clsx("w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
                                        </button>
                                        <button
                                            onClick={() => handleCopy(room?.password, 'password')}
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
                                </div>
                                <p className={clsx("font-mono text-xl tracking-widest", isDark ? "text-white" : "text-slate-900")}>
                                    {room?.password}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSettings(false)}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyRoomView;
