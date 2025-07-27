const express = require('express');
const axios = require('axios');
const router = express.Router();

// Sample supplier data
const suppliers = [
  { name: "FreshFoods", location: "18.4571,73.8500", rating: 4.6, price: 30 },
  { name: "LocalMandi", location: "18.4550,73.8600", rating: 4.1, price: 20 },
  { name: "BazaarBuddy", location: "18.4600,73.8400", rating: 4.8, price: 35 }
];

router.post('/', async (req, res) => {
  const { userLat, userLng } = req.body;
  if (!userLat || !userLng) return res.status(400).json({ error: 'Location missing' });

  try {
    const origins = `${userLat},${userLng}`;
    const destinations = suppliers.map(s => s.location).join('|');

    const distanceRes = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins,
        destinations,
        key: process.env.GOOGLE_API_KEY
      }
    });

    const rows = distanceRes.data.rows[0].elements;

    const results = suppliers.map((s, i) => ({
      name: s.name,
      rating: s.rating,
      price: s.price,
      distanceText: rows[i].distance.text,
      distanceValue: rows[i].distance.value
    }));

    // Sort: nearest + higher rating + lower price
    results.sort((a, b) =>
      a.distanceValue - b.distanceValue ||
      b.rating - a.rating ||
      a.price - b.price
    );

    res.json({ suppliers: results });
  } catch (err) {
    res.status(500).json({ error: 'Distance API failed', details: err.response?.data || err.message });
  }
});

module.exports = router;
