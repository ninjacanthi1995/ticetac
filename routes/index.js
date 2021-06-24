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

router.get('/tickets', async (req, res) => {
  const tickets = [
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
  res.render('tickets', { tickets: tickets });
});

module.exports = router;
