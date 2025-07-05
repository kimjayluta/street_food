const express = require('express');
const router = express.Router();
const pwestoController = require('../controllers/pwestoController');

router.get('/', pwestoController.getAllPwesto);
router.get('/:id', pwestoController.getPwestoById);
router.post('/', pwestoController.createPwesto);
router.put('/:id', pwestoController.updatePwesto);
router.delete('/:id', pwestoController.deletePwesto);

module.exports = router;