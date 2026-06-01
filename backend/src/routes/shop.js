const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/', shopController.getAllShops);
router.get('/:id', shopController.getShopById);
router.post('/', express.json(), shopController.createShop);
router.put('/:id', express.json(), shopController.updateShop);
router.delete('/:id', shopController.deleteShop);

module.exports = router;