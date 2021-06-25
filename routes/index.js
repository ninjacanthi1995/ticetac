var express = require("express");
var router = express.Router();

const journeyModel = require("../models/journeys");
const userModel = require("../models/users");

/* GET home page. */
router.get('/', async function(req, res, next) {
  if(req.session.user){
    res.redirect("/home")
  // }else{
  //   req.session.user = await userModel.find({ email: "dorian@mail.com" })
  //   req.session.user = req.session.user[0]
  //   res.redirect('/home')
  }
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

router.get('/tickets', (req, res) => {
  if(req.session.user){
    res.render('tickets', { tickets: req.session.tickets });
  }
  res.redirect('/')
});

router.post('/journeys-to-db', async (req, res) => {
  const user = await userModel.findById(req.session.user._id)
  user.journeys.push(...JSON.parse(req.body.arrayid))
  user.save()
  res.redirect("/home")
})

module.exports = router;
