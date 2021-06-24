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
      req.session.user = await newUser.save();
      res.redirect("/home");
    });
  } else {
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
          req.session.user = {
            email: searchUser.email,
          };
          res.redirect("/home");
        } else {
          // Passwords don't match
          res.redirect("/");
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

router.get("/logout", async (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

router.get("/journeys", async (req, res) => {
  const journeys = [
    {
      departure: "Rennes",
      arrival: "Lille",
      date: {
        $date: "2018-11-24T00:00:00.000Z",
      },
      departureTime: "13:00",
      price: 117,
      __v: 0,
    },
    {
      departure: "Nantes",
      arrival: "Lille",
      date: {
        $date: "2018-11-24T00:00:00.000Z",
      },
      departureTime: "18:00",
      price: 109,
      __v: 0,
    }
  ];

  const user = await userModel
    .findOne({ email: req.session.user.email })
    .populate("journeys");
  res.render("journeys", { journeys: journeys });
});

module.exports = router;
