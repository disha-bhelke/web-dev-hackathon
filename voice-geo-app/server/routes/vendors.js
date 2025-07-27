const express = require('express');
const router = express.Router();
const vendors = require('../data/vendors.json');
const pool = require('../db/mongo'); 

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
router.get('/test', (req, res) => {
  res.json({ msg: "Vendor route working" });
});




router.post('/nearby', (req, res) => {
  const { latitude, longitude } = req.body;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Invalid or missing latitude/longitude (must be numbers)' });
  }

  const nearby = vendors
    .map((vendor) => {
      const distance = getDistance(latitude, longitude, vendor.latitude, vendor.longitude);
      return {
        ...vendor,
        distance: parseFloat(distance.toFixed(2)),
        mapLink: `https://www.google.com/maps?q=${vendor.latitude},${vendor.longitude}`
      };
    })
    .filter((v) => v.distance <= 5)
    .sort((a, b) => a.distance - b.distance);

  res.json(nearby);
});

module.exports = router;
