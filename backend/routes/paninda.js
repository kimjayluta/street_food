const express = require('express');
const router = express.Router();
const panindaController = require('../controllers/panindaController');

router.get('/', panindaController.getAllPaninda);
router.get('/:id', panindaController.getPanindaById);
router.post('/', panindaController.createPaninda);
router.put('/:id', panindaController.updatePaninda);
router.delete('/:id', panindaController.deletePaninda);

module.exports = router;