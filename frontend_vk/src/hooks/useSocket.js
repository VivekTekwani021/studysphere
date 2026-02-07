import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (roomId, userId, userName) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        if (!roomId || !userId || !userName) return;

        // Initialize socket connection
        socketRef.current = io(SOCKET_URL, {
            withCredentials: true,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            setIsConnected(true);
            // Join the room
            socket.emit('join-room', { roomId, userId, userName });
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        // Handle new messages
        socket.on('new-message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        // Handle user joined
        socket.on('user-joined', ({ userId, userName, message }) => {
            setParticipants((prev) => [...prev, { _id: userId, name: userName }]);
            // Add system message
            setMessages((prev) => [
                ...prev,
                { content: message, isSystem: true, timestamp: new Date() },
            ]);
        });

        // Handle user left
        socket.on('user-left', ({ userId, userName, message }) => {
            setParticipants((prev) => prev.filter((p) => p._id !== userId));
            // Add system message
            setMessages((prev) => [
                ...prev,
                { content: message, isSystem: true, timestamp: new Date() },
            ]);
        });

        // Cleanup on unmount
        return () => {
            socket.emit('leave-room', { roomId, userName });
            socket.disconnect();
        };
    }, [roomId, userId, userName]);

    const sendMessage = (message) => {
        if (socketRef.current && message.trim()) {
            socketRef.current.emit('send-message', {
                roomId,
                message,
                userId,
                userName,
            });
        }
    };

    const emitDraw = (drawData) => {
        if (socketRef.current) {
            socketRef.current.emit('draw', { roomId, drawData });
        }
    };

    const clearCanvas = () => {
        if (socketRef.current) {
            socketRef.current.emit('clear-canvas', { roomId });
        }
    };

    const onDraw = (callback) => {
        if (socketRef.current) {
            socketRef.current.on('draw', callback);
        }
    };

    const onClearCanvas = (callback) => {
        if (socketRef.current) {
            socketRef.current.on('clear-canvas', callback);
        }
    };

    return {
        socket: socketRef.current,
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
    };
};
