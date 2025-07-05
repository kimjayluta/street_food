const express = require('express');
const router = express.Router();
const salesLogController = require('../controllers/salesLogController');

router.get('/', salesLogController.getAllSalesLogs);
router.get('/:id', salesLogController.getSalesLogById);
router.post('/', salesLogController.createSalesLog);
router.put('/:id', salesLogController.updateSalesLog);
router.delete('/:id', salesLogController.deleteSalesLog);

module.exports = router;