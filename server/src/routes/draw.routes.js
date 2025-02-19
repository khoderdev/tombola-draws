const express = require('express');
const { body } = require('express-validator');
const drawController = require('../controllers/draw.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes with optional authentication
router.get('/', optionalAuth, drawController.getDraws);
router.get('/:id', drawController.getDraw);

// Protected routes (require authentication)
router.post('/:drawId/enter', protect, drawController.enterDraw);
router.get('/my/tickets', protect, drawController.getMyTickets);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('prize').trim().notEmpty().withMessage('Prize is required'),
    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
      .isFloat({ min: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  drawController.createDraw
);

router.put('/:id', protect, authorize('admin'), drawController.updateDraw);
router.delete('/:id', protect, authorize('admin'), drawController.deleteDraw);

module.exports = router;
