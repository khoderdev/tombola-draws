const express = require('express');
const adminController = require('../controllers/admin.controller');
const drawController = require('../controllers/draw.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Draw management routes
router.get('/draws', adminController.getDraws);
router.post('/draws', drawController.createDraw);
router.put('/draws/:id', drawController.updateDraw);
router.delete('/draws/:id', drawController.deleteDraw);
router.patch('/draws/:drawId/toggle-status', drawController.toggleDrawStatus);

module.exports = router;
