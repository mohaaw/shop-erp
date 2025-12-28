const { Server } = require('socket.io');
const db = require('../db');

let io;

const os = require('os');

function getCpuUsage() {
    return new Promise((resolve) => {
        const start = os.cpus();
        const startUsage = start.reduce((acc, cpu) => {
            acc.idle += cpu.times.idle;
            acc.total += Object.values(cpu.times).reduce((a, b) => a + b, 0);
            return acc;
        }, { idle: 0, total: 0 });

        setTimeout(() => {
            const end = os.cpus();
            const endUsage = end.reduce((acc, cpu) => {
                acc.idle += cpu.times.idle;
                acc.total += Object.values(cpu.times).reduce((a, b) => a + b, 0);
                return acc;
            }, { idle: 0, total: 0 });

            const idleDiff = endUsage.idle - startUsage.idle;
            const totalDiff = endUsage.total - startUsage.total;
            const percentage = 100 - Math.floor((100 * idleDiff) / totalDiff);

            resolve(percentage);
        }, 1000);
    });
}

exports.init = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // System Monitor Loop
    setInterval(async () => {
        try {
            // CPU
            const cpuUsage = await getCpuUsage();

            // RAM
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const memUsage = Math.round((usedMem / totalMem) * 100);

            // DB Status
            let dbStatus = 'disconnected';
            try {
                const check = db.prepare('SELECT 1').get();
                if (check) dbStatus = 'connected';
            } catch (e) {
                dbStatus = 'error';
            }

            const stats = {
                cpu: cpuUsage,
                ram: memUsage,
                ramUsed: Math.round(usedMem / 1024 / 1024), // MB
                ramTotal: Math.round(totalMem / 1024 / 1024), // MB
                db: dbStatus,
                timestamp: new Date().toISOString()
            };

            io.emit('system_stats', stats);
        } catch (err) {
            console.error('Error broadcasting system stats:', err);
        }
    }, 2000);

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
