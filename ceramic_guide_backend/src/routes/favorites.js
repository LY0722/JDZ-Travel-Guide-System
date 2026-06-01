const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites');

router.post('/', express.json(), favoritesController.createFavorite);
router.get('/', favoritesController.getAllFavorites);
router.get('/:id', favoritesController.getFavoriteById);
router.delete('/:id', favoritesController.deleteFavorite);
router.get('/user/:user_id', favoritesController.getFavoritesByUser);

module.exports = router;