const express = require('express');
const router = express.Router();
const qaRecordsController = require('../controllers/qaRecords');

router.get('/', qaRecordsController.getAllRecords);
router.get('/:id', qaRecordsController.getRecordById);
router.post('/', express.json(), qaRecordsController.createRecord);
router.delete('/:id', qaRecordsController.deleteRecord);

module.exports = router;