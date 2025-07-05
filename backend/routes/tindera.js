const express = require('express');
const router = express.Router();
const tinderaController = require('../controllers/tinderaController');

router.get('/', tinderaController.getAllTindera);
router.get('/:id', tinderaController.getTinderaById);
router.post('/', tinderaController.createTindera);
router.put('/:id', tinderaController.updateTindera);
router.delete('/:id', tinderaController.deleteTindera);

module.exports = router;