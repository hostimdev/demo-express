var express = require('express');
var router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads/avatars';

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

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
router.post('/', upload.single('avatar'), async function (req, res, next) {
  try {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      status: req.body.status || 'active'
    };

    // Add avatar path if a file was uploaded
    if (req.file) {
      userData.avatarPath = '/uploads/avatars/' + req.file.filename;
    }

    const user = await User.create(userData);

    // Invalidate the users cache when a new user is added
    await req.redisClient.del('all_users');

    res.redirect('/users');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
