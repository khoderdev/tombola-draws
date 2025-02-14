const express = require('express');
const ticketController = require('../controllers/ticket.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get my tickets
router.get('/my-tickets', ticketController.getMyTickets);

// Purchase a ticket for a draw
router.post('/draws/:drawId/tickets', ticketController.purchaseTicket);

// Get ticket details
router.get('/tickets/:ticketId', ticketController.getTicketDetails);

module.exports = router;
