var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

const userModel = require("../models/users");

/* GET users listing. */
router.get("/", function (req, res) {
  res.render("index");
});

router.post("/sign-up", async (req, res) => {
  const searchUser = await userModel.findOne({
    email: req.body.email,
  });
  if (!searchUser) {
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      const newUser = new userModel({
        name: req.body.name,
        firstName: req.body.firstName,
        email: req.body.email,
        password: hash,
        journeys: [],
      });
      const savedUser = await newUser.save();
      req.session.user = {
        email: savedUser.email,
      };
    });
    res.redirect("/home");
  } else {
    res.redirect("/");
  }
});

router.post("/sign-in", async (req, res) => {
  const searchUser = await userModel.findOne({
    email: req.body.email
  });
  if (searchUser) {
    bcrypt.compare(req.body.password, searchUser.password, async function (err, result) {
      if (result) {
        // Passwords match
        req.session.user = {
          email: searchUser.email,
        };
        res.redirect("/home");
      } else {
        // Passwords don't match
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
});

router.get("/logout", async (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

module.exports = router;
