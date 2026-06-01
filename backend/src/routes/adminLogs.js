const express = require('express');
const router = express.Router();
const adminLogsController = require('../controllers/adminLogs');

router.get('/', adminLogsController.getAllLogs);
router.get('/:id', adminLogsController.getLogById);
router.post('/', express.json(), adminLogsController.createLog);
router.delete('/:id', adminLogsController.deleteLog);

module.exports = router;