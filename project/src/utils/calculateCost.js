const calculateTravelTime = (distanceKm) => {
  const timePerKm = 3.5;
  return Math.round(distanceKm * timePerKm);
};

const calculateTravelCost = (distanceKm) => {
  const costPerKm = 5;
  return parseFloat((distanceKm * costPerKm).toFixed(2));
};

const calculateFinalBill = (servicePrice, travelCost) => {
  return parseFloat((servicePrice + travelCost).toFixed(2));
};

module.exports = {
  calculateTravelTime,
  calculateTravelCost,
  calculateFinalBill,
};
