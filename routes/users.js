var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

const userModel = require("../models/users");

/* GET users listing. */

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
      req.session.user = savedUser;
      req.session.tickets = [];
      res.redirect("/home");
    });
  } else {
    req.session.error = "Email existe déjà";
    res.redirect("/");
  }
});

router.post("/sign-in", async (req, res) => {
  const searchUser = await userModel.findOne({
    email: req.body.email,
  });
  if (searchUser) {
    bcrypt.compare(
      req.body.password,
      searchUser.password,
      async function (err, result) {
        if (result) {
          // Passwords match
          req.session.user = searchUser;
          req.session.tickets = [];
          res.redirect("/home");
        } else {
          // Passwords don't match
          req.session.error = 'Mot de passe incorrect!';
          res.redirect("/");
        }
      }
    );
  } else {
    req.session.error = 'Utilisateur non trouvé!';
    res.redirect("/");
  }
});

router.get("/logout", async (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

router.get("/journeys", async (req, res) => {
  if(req.session.user){
    const user = await userModel
      .findById(req.session.user._id)
      .populate("journeys");
    res.render("journeys", { journeys: user.journeys });
  }else{
    res.redirect("/")
  }
});

module.exports = router;
