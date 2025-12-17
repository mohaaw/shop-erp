const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        // Stop retrying after 3 attempts (approx 1-2 seconds) to avoid console spam
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                // Return an error to stop the client from retrying
                return new Error('Redis connection failed, disabling cache.');
            }
            return Math.min(retries * 100, 1000);
        }
    }
});

// Suppress excessive error logging for connection refused (common in dev without Redis)
redisClient.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        // Silent failure is preferred by user for local dev
        return;
    }
    console.error('Redis Client Error', err);
});

// Connect to redis
(async () => {
    try {
        await redisClient.connect();
        console.log('✅ Connected to Redis');
    } catch (err) {
        console.log('ℹ️  Redis not available, caching disabled (OK for local dev)');
    }
})();

module.exports = {
    client: redisClient,

    // Helper to get parsed JSON
    get: async (key) => {
        if (!redisClient.isOpen) return null;
        try {
            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Redis get error for key ${key}:`, e);
            return null;
        }
    },

    // Helper to set JSON with expiry
    set: async (key, value, ttlSeconds = 300) => {
        if (!redisClient.isOpen) return;
        try {
            await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
        } catch (e) {
            console.error(`Redis set error for key ${key}:`, e);
        }
    },

    // Helper to clear keys by pattern
    clearPattern: async (pattern) => {
        if (!redisClient.isOpen) return;
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } catch (e) {
            console.error(`Redis clear pattern error for ${pattern}:`, e);
        }
    }
};
