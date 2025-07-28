const express = require('express');
const router = express.Router();
const facilitiesController = require('../controllers/facilitiesController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdminOrAbove } = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, facilitiesController.getAllFacilities);
router.post('/', authMiddleware, isAdminOrAbove, facilitiesController.createFacility);
router.post('/batch', authMiddleware, isAdminOrAbove, facilitiesController.batchCreateFacilities);
router.put('/:id', authMiddleware, isAdminOrAbove, facilitiesController.updateFacility);
router.delete('/:id', authMiddleware, isAdminOrAbove, facilitiesController.deleteFacility);

module.exports = router; 