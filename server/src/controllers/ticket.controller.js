const { User, Draw, Ticket } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Draw,
          attributes: ['id', 'title', 'prize', 'endDate', 'status', 'price'],
        },
      ],
      order: [['purchaseDate', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      data: {
        tickets: tickets.map((ticket) => ({
          id: ticket.id,
          number: ticket.number,
          status: ticket.status,
          paymentStatus: ticket.paymentStatus,
          purchaseDate: ticket.purchaseDate,
          draw: ticket.Draw,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tickets',
    });
  }
};

exports.purchaseTicket = async (req, res) => {
  try {
    const { drawId } = req.params;
    const { paymentMethod } = req.body;
    const userId = req.user.id;

    // Find the draw
    const draw = await Draw.findByPk(drawId);
    if (!draw) {
      return res.status(404).json({
        status: 'error',
        message: 'Draw not found',
      });
    }

    // Check if draw is active
    if (draw.status !== 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'Draw is not active',
      });
    }

    // Check if draw has reached max tickets
    const ticketCount = await Ticket.count({ where: { drawId } });
    if (draw.maxTickets && ticketCount >= draw.maxTickets) {
      return res.status(400).json({
        status: 'error',
        message: 'Draw has reached maximum number of tickets',
      });
    }

    // Generate unique ticket number
    const ticketNumber = uuidv4().substring(0, 8).toUpperCase();

    // Create ticket with pending status
    const ticket = await Ticket.create({
      number: ticketNumber,
      userId,
      drawId,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      paymentReference: uuidv4(),
    });

    res.status(201).json({
      status: 'success',
      message: 'Ticket subscription pending approval',
      data: {
        ticket: {
          id: ticket.id,
          number: ticket.number,
          status: ticket.status,
          paymentStatus: ticket.paymentStatus,
          paymentReference: ticket.paymentReference,
          purchaseDate: ticket.purchaseDate,
        },
      },
    });
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error purchasing ticket',
    });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, adminNote } = req.body;

    // Only admin can update ticket status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized to perform this action',
      });
    }

    const ticket = await Ticket.findByPk(ticketId, {
      include: [{ model: Draw, as: 'Draw' }],
    });

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    // Update ticket status
    if (status === 'accepted') {
      ticket.status = 'active';
      ticket.paymentStatus = 'completed';
    } else if (status === 'declined') {
      ticket.status = 'declined';
      ticket.paymentStatus = 'failed';
    }

    if (adminNote) {
      ticket.adminNote = adminNote;
    }

    await ticket.save();

    res.status(200).json({
      status: 'success',
      message: `Ticket ${status} successfully`,
      data: {
        ticket,
      },
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating ticket status',
    });
  }
};

exports.getTicketDetails = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({
      where: { id: ticketId },
      include: [
        {
          model: Draw,
          attributes: ['id', 'title', 'prize', 'endDate', 'status', 'price'],
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    // Check if user is authorized to view ticket details
    if (!req.user.isAdmin && ticket.userId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized to view ticket details',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        ticket,
      },
    });
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching ticket details',
    });
  }
};
