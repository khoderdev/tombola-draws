const { Draw, Ticket, User } = require("../models");
const { Op } = require("sequelize");

exports.getDraws = async (req, res) => {
  try {
    const userId = req.user?.id;
    let draws = await Draw.findAll({
      where: {
        status: "active",
        endDate: {
          [Op.gt]: new Date(),
        },
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    if (userId) {
      // Get all tickets for this user with their status
      const userTickets = await Ticket.findAll({
        where: { userId: userId },
        attributes: ['drawId', 'status', 'id'],
        raw: true,
      });

      // Create a map of drawId to ticket info
      const userTicketMap = userTickets.reduce((map, ticket) => {
        map[ticket.drawId] = {
          status: ticket.status,
          id: ticket.id
        };
        return map;
      }, {});

      // Add ticket info to each draw
      draws = draws.map(draw => {
        const ticketInfo = userTicketMap[draw.id];
        return {
          ...draw,
          hasEntered: !!ticketInfo,
          ticketStatus: ticketInfo ? ticketInfo.status : null,
          ticketId: ticketInfo ? ticketInfo.id : null,
        };
      });
    }

    res.status(200).json({
      status: "success",
      data: draws,
    });
  } catch (error) {
    console.error("Error in getDraws:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching draws",
    });
  }
};

exports.getDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const draw = await Draw.findByPk(id);

    if (!draw) {
      return res.status(404).json({
        status: 'error',
        message: 'Draw not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: draw,
    });
  } catch (error) {
    console.error('Error in getDraw:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching draw',
    });
  }
};

exports.getMyDraws = async (req, res) => {
  try {
    const draws = await Draw.findAll({
      include: [
        {
          model: Ticket,
          where: { userId: req.user.id },
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      data: draws,
    });
  } catch (error) {
    console.error("Error in getMyDraws:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching your draws",
    });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.findAll({
      where: { userId: userId },
      include: [{
        model: Draw,
        as: 'Draw',
        attributes: ['title', 'prize','price','endDate', 'status']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: {
        tickets: tickets
      }
    });
  } catch (error) {
    console.error('Error in getMyTickets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tickets',
    });
  }
};

exports.createDraw = async (req, res) => {
  try {
    const { title, prize, price, startDate, endDate, image, status } = req.body;

    // Validate required fields
    if (!title || !prize || !price || !startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    // Only allow admins to set status
    const initialStatus = req.user.role === 'admin' ? (status || 'inactive') : 'inactive';

    const draw = await Draw.create({
      title,
      prize,
      price,
      startDate,
      endDate,
      image,
      status: initialStatus,
    });

    res.status(201).json({
      status: 'success',
      data: draw,
    });
  } catch (error) {
    console.error('Error creating draw:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating draw',
    });
  }
};

exports.updateDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, prize, price, startDate, endDate, image, status } = req.body;

    const draw = await Draw.findByPk(id);

    if (!draw) {
      return res.status(404).json({
        status: 'error',
        message: 'Draw not found',
      });
    }

    // Only allow admins to update status
    const updateData = {
      ...(title && { title }),
      ...(prize && { prize }),
      ...(price && { price }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(image && { image }),
    };

    if (req.user.role === 'admin' && status) {
      updateData.status = status;
    }

    await draw.update(updateData);

    res.status(200).json({
      status: 'success',
      data: draw,
    });
  } catch (error) {
    console.error('Error updating draw:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating draw',
    });
  }
};

exports.deleteDraw = async (req, res) => {
  try {
    const { id } = req.params;

    const draw = await Draw.findByPk(id);
    if (!draw) {
      return res.status(404).json({
        status: "error",
        message: "Draw not found",
      });
    }

    await draw.destroy();

    res.status(200).json({
      status: "success",
      message: "Draw deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting draw",
    });
  }
};

exports.purchaseTicket = async (req, res) => {
  try {
    const { drawId } = req.params;
    const userId = req.user.id;

    const draw = await Draw.findByPk(drawId);
    if (!draw) {
      return res.status(404).json({
        status: "error",
        message: "Draw not found",
      });
    }

    if (draw.status !== "active" || draw.endDate <= new Date()) {
      return res.status(400).json({
        status: "error",
        message: "Draw is not active",
      });
    }

    // Generate unique ticket number
    const ticketNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

    const ticket = await Ticket.create({
      number: ticketNumber,
      userId: userId,
      drawId: drawId,
    });

    res.status(201).json({
      status: "success",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error purchasing ticket",
    });
  }
};

exports.selectWinner = async (req, res) => {
  try {
    const { drawId } = req.params;

    const draw = await Draw.findByPk(drawId, {
      include: [
        {
          model: Ticket,
          where: { status: "active" },
          include: [{ model: User }],
        },
      ],
    });

    if (!draw) {
      return res.status(404).json({
        status: "error",
        message: "Draw not found",
      });
    }

    if (draw.status !== "active" || draw.endDate > new Date()) {
      return res.status(400).json({
        status: "error",
        message: "Draw cannot be completed yet",
      });
    }

    if (draw.Tickets.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No tickets purchased for this draw",
      });
    }

    // Randomly select winner
    const winningTicket =
      draw.Tickets[Math.floor(Math.random() * draw.Tickets.length)];

    // Update draw and tickets
    await draw.update({
      status: "completed",
      winnerId: winningTicket.User.id,
    });

    await Ticket.update(
      { status: "lost" },
      { where: { drawId, status: "active" } }
    );

    await winningTicket.update({ status: "won" });

    res.status(200).json({
      status: "success",
      data: {
        winner: winningTicket.User,
        ticket: winningTicket,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error selecting winner",
    });
  }
};

exports.enterDraw = async (req, res) => {
  try {
    const { drawId } = req.params;
    const userId = req.user.id;

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
        message: 'This draw is not currently active',
      });
    }

    // Check if user has already entered this draw
    const existingTicket = await Ticket.findOne({
      where: {
        drawId,
        userId,
      },
    });

    if (existingTicket) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already entered this draw',
      });
    }

    // Create ticket
    const ticket = await Ticket.create({
      drawId,
      userId,
      number: Math.random().toString(36).substring(2, 8).toUpperCase(), // Generate a random 6-character ticket number
    });

    res.status(201).json({
      status: 'success',
      data: ticket,
    });
  } catch (error) {
    console.error('Error entering draw:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error entering draw',
    });
  }
};

exports.toggleDrawStatus = async (req, res) => {
  try {
    const { drawId } = req.params;
    const draw = await Draw.findByPk(drawId);

    if (!draw) {
      return res.status(404).json({
        status: 'error',
        message: 'Draw not found',
      });
    }

    // Toggle the status
    const newStatus = draw.status === 'active' ? 'inactive' : 'active';
    await draw.update({ status: newStatus });

    res.status(200).json({
      status: 'success',
      data: {
        id: draw.id,
        status: newStatus,
      },
    });
  } catch (error) {
    console.error('Error toggling draw status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating draw status',
    });
  }
};
