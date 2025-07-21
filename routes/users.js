var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const users = await User.findAll();
    res.render('users', { title: 'Users', users });
  } catch (error) {
    next(error);
  }
});

/* POST new user */
router.post('/', async function (req, res, next) {
  try {
    const user = await User.create(req.body);
    res.redirect('/users');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
