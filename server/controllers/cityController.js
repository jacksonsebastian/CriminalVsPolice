const cities = require('../utils/cities.json');

exports.getAllCities = (req, res) => {
  res.json(cities);
};