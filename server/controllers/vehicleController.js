const vehicles = require('../utils/vehicles.json');

exports.getAllVehicles = (req, res) => {
  res.json(vehicles);
};
