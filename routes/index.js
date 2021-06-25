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

router.post("/push-journey", async (req, res) => {
  if(!req.session.tickets){
    req.session.tickets = []
  }
  const alreadyThere_ = req.session.tickets.find(e => e._id === req.body.id)
  if(!alreadyThere_){
    const ticket = await journeyModel.findById(req.body.id)
    req.session.tickets.push(ticket)
  }

  res.redirect('/tickets')
});

router.get('/tickets', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    res.render('tickets', { tickets: req.session.tickets });
  }
});

router.get('/delete-ticket', (req, res) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    req.session.tickets.splice(req.query.index, 1);
    res.render('tickets', { tickets: req.session.tickets });
  }
});

module.exports = router;
