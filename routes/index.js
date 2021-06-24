var express = require("express");
var router = express.Router();

const journeyModel = require("../models/journeys");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get("/home", async function (req, res) {
  if (req.session.user) {
    res.render("home", { journeys: req.session.journeys });
  } else {
    res.redirect('/');
  };
});

router.post("/search", async (req, res) => {
  req.session.journeys = await journeyModel.find({
    departure: req.body.fromCity,
    arrival: req.body.toCity,
    date: new Date(req.body.date),
  });
  res.redirect("/home");
});

module.exports = router;
