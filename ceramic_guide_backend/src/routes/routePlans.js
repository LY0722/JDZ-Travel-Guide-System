const express = require('express');
const router = express.Router();
const routePlansController = require('../controllers/routePlans');

router.get('/', routePlansController.getAllPlans);
router.get('/:id', routePlansController.getPlanById);
router.post('/', express.json(), routePlansController.createPlan);
router.delete('/:id', routePlansController.deletePlan);

module.exports = router;