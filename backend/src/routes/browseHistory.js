const express = require('express');
const router = express.Router();
const browseHistoryController = require('../controllers/browseHistory');

router.get('/', browseHistoryController.getAllHistory);
router.get('/:id', browseHistoryController.getHistoryById);
router.post('/', express.json(), browseHistoryController.createHistory);
router.delete('/:id', browseHistoryController.deleteHistory);
router.get('/user/:user_id', browseHistoryController.getHistoryByUser);

module.exports = router;