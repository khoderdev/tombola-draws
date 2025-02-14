const { User, Draw, Ticket } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Draw,
          attributes: ['id', 'title', 'prize', 'endDate', 'status'],
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
          purchaseDate: ticket.purchaseDate,
          price: ticket.price,
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

    // Check if draw has ended
    if (new Date(draw.endDate) < new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'Draw has ended',
      });
    }

    // Check if user already has a ticket for this draw
    const existingTicket = await Ticket.findOne({
      where: {
        UserId: userId,
        DrawId: drawId,
      },
    });

    if (existingTicket) {
      return res.status(400).json({
        status: 'error',
        message: 'You already have a ticket for this draw',
      });
    }

    // Check if draw has reached max tickets
    const ticketCount = await Ticket.count({
      where: { DrawId: drawId },
    });

    if (ticketCount >= draw.maxTickets) {
      return res.status(400).json({
        status: 'error',
        message: 'Draw is full',
      });
    }

    // Generate unique ticket number
    const ticketNumber = `${drawId.slice(0, 4)}-${uuidv4().slice(0, 8)}`.toUpperCase();

    // Create ticket
    const ticket = await Ticket.create({
      number: ticketNumber,
      price: draw.price,
      UserId: userId,
      DrawId: drawId,
    });

    res.status(201).json({
      status: 'success',
      data: {
        ticket: {
          id: ticket.id,
          number: ticket.number,
          status: ticket.status,
          purchaseDate: ticket.purchaseDate,
          price: ticket.price,
          draw: {
            id: draw.id,
            title: draw.title,
            prize: draw.prize,
            endDate: draw.endDate,
            status: draw.status,
          },
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

exports.getTicketDetails = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;

    const ticket = await Ticket.findOne({
      where: { id: ticketId, UserId: userId },
      include: [
        {
          model: Draw,
          attributes: ['id', 'title', 'prize', 'endDate', 'status', 'winnerId'],
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        ticket: {
          id: ticket.id,
          number: ticket.number,
          status: ticket.status,
          purchaseDate: ticket.purchaseDate,
          price: ticket.price,
          draw: ticket.Draw,
          isWinner: ticket.Draw.winnerId === userId,
        },
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
