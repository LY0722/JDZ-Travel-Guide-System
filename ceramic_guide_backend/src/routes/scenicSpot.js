const express = require('express');
const router = express.Router();
const scenicSpotController = require('../controllers/scenicSpot');

router.get('/', scenicSpotController.getAllSpots);
router.get('/:id', scenicSpotController.getSpotById);
router.post('/', express.json(), scenicSpotController.createSpot);
router.put('/:id', express.json(), scenicSpotController.updateSpot);
router.delete('/:id', scenicSpotController.deleteSpot);

module.exports = router;