var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    // Try to get users from Redis cache
    const cachedUsers = await req.redisClient.get('all_users');

    if (cachedUsers) {
      console.log('Serving users from cache');
      const users = JSON.parse(cachedUsers);
      return res.render('users', {
        title: 'Users',
        users,
        dataSource: 'Cache (Redis)'
      });
    }

    // If not in cache, get from database
    const users = await User.findAll();

    // Store in Redis with 1 hour expiration
    await req.redisClient.setEx('all_users', 3600, JSON.stringify(users));

    res.render('users', {
      title: 'Users',
      users,
      dataSource: 'Database (PostgreSQL)'
    });
  } catch (error) {
    next(error);
  }
});

/* POST new user */
router.post('/', async function (req, res, next) {
  try {
    const user = await User.create(req.body);

    // Invalidate the users cache when a new user is added
    await req.redisClient.del('all_users');

    res.redirect('/users');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
