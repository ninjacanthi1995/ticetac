var express = require('express');
var router = express.Router();

const userModel = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/sign-up', async (req, res) => {
  const searchUser = await userModel.findOne({
    email: req.body.email
  });
  if (!searchUser) {
    const newUser = new userModel({
      name: req.body.name,
      firstName: req.body.firstName,
      email: req.body.email,
      password: req.body.password,
      journeys: []
    });
    const savedUser = await newUser.save();
    req.session.user = {
      email: savedUser.email
    };
    res.redirect('/home');
  } else {
    res.redirect('/');
  };
});

router.post('/sign-in', async (req, res) => {
  const searchUser = await userModel.findOne({
    email: req.body.email,
    password: req.body.password
  });
  if (searchUser) {
    req.session.user = {
      email: searchUser.email
    };
    res.redirect('/home');
  } else {
    res.redirect('/');
  };
});

module.exports = router;
