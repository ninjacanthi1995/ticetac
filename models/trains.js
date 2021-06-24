const mongoose = require('mongoose')

const journeySchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number,
});

const journeyModel = mongoose.model('journey', journeySchema);

const city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
const date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]


module.exports = journeyModel