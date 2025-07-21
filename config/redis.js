const redis = require('redis');

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to Redis:', error);
  }
})();

module.exports = redisClient;
