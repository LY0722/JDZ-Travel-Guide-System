const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratings');

router.get('/', ratingsController.getAllRatings);
router.get('/:id', ratingsController.getRatingById);
router.post('/', express.json(), ratingsController.createRating);
router.delete('/:id', ratingsController.deleteRating);

module.exports = router;