const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/images');

router.get('/', imagesController.getImagesByRelated);

module.exports = router;