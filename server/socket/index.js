const { Server } = require('socket.io');
const db = require('../db');

let io;

exports.init = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });

        socket.on('send_message', (data) => {
            // data: { content, senderId, senderName }
            console.log('Message received:', data);

            // Save to DB
            try {
                const now = new Date().toISOString();
                const id = Math.random().toString(36).substring(7);

                // Check if Message table exists (it should now)
                const stmt = db.prepare(`
          INSERT INTO Message (id, content, senderId, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?)
        `);
                stmt.run(id, data.content, data.senderId, now, now);

                // Broadcast to all clients
                io.emit('receive_message', {
                    id,
                    content: data.content,
                    senderId: data.senderId,
                    senderName: data.senderName,
                    createdAt: now
                });
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('send_announcement', (data) => {
            io.emit('receive_announcement', data);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });

    return io;
};

exports.getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
