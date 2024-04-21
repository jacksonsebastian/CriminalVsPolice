const cities = require('../utils/cities.json');
const vehicles = require('../utils/vehicles.json');

// Function to simulate fugitive's location
const simulateFugitiveLocation = () => {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
};

const captureFugitive = (copChoices, fugitiveLocation) => {
  let successfulCapture = false;
  let capturedCop = null;

  copChoices.forEach(cop => {
    const chosenVehicle = vehicles.find(vehicle => vehicle.kind === cop.vehicle);
    const distanceToCity = cities.find(city => city.city === cop.city).distance;
    if (chosenVehicle && chosenVehicle.range_km >= distanceToCity) {
      successfulCapture = true;
      capturedCop = { name: cop.name, city: cop.city };
    }
  });

  if (successfulCapture) {
    return { status: 1, message: `Criminal captured by ${capturedCop.name} in ${capturedCop.city}` };
  } else {
    return { status: -1, message: `Criminal espcaped!` };
  }
};

exports.simulateCapture = (copChoices) => {
  const fugitiveLocation = simulateFugitiveLocation();
  return captureFugitive(copChoices, fugitiveLocation);
};
