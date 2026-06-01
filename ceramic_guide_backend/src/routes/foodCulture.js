const express = require('express');
const router = express.Router();
const foodCultureController = require('../controllers/foodCulture');

router.get('/', foodCultureController.getAllFoods);
router.get('/:id', foodCultureController.getFoodById);
router.post('/', express.json(), foodCultureController.createFood);
router.put('/:id', express.json(), foodCultureController.updateFood);
router.delete('/:id', foodCultureController.deleteFood);

module.exports = router;