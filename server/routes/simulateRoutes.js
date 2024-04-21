// simulateRoutes.js
const express = require('express');
const router = express.Router();
const simulateController = require('../controllers/simulateController');

router.post('/simulate', (req, res) => {
  const copChoices = req.body.cops;
  const result = simulateController.simulateCapture(copChoices);
  res.json(result);
});

module.exports = router;
