const { User, Draw, Ticket } = require("../models");
const { v4: uuidv4 } = require("uuid");
const activityTracker = require('../utils/activityTracker');

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Draw,
          as: "Draw",
          attributes: ["id", "title", "prize", "endDate", "status", "price"],
        },
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email", "avatar"],
        }
      ],
      order: [["purchaseDate", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      data: {
        tickets: tickets.map((ticket) => {
          const plainTicket = ticket.get({ plain: true });
          return {
            ...plainTicket,
            User: plainTicket.User,
            Draw: plainTicket.Draw
              ? {
                  ...plainTicket.Draw,
                  price: parseFloat(plainTicket.Draw.price).toFixed(2),
                }
              : null,
          };
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching tickets",
    });
  }
};

exports.purchaseTicket = async (req, res) => {
  try {
    const { drawId, quantity } = req.body;
    const userId = req.user.id;

    const draw = await Draw.findByPk(drawId);
    if (!draw) {
      return res.status(404).json({
        status: 'error',
        message: 'Draw not found',
      });
    }

    const tickets = await Ticket.bulkCreate(
      Array(quantity).fill({
        drawId,
        userId,
        status: 'active',
      })
    );

    // Track ticket purchase
    await activityTracker.trackTicketActivity(
      'Tickets Purchased',
      `${quantity} ticket(s) purchased for draw: ${draw.title}`,
      userId,
      { drawId, quantity }
    );

    res.status(201).json({
      status: 'success',
      data: { tickets },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.cancelTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ticket = await Ticket.findOne({
      where: { id, userId },
      include: [{ model: Draw, as: 'draw' }],
    });

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found',
      });
    }

    await ticket.update({ status: 'cancelled' });

    // Track ticket cancellation
    await activityTracker.trackTicketActivity(
      'Ticket Cancelled',
      `Ticket cancelled for draw: ${ticket.draw.title}`,
      userId,
      { ticketId: id, drawId: ticket.drawId }
    );

    res.json({
      status: 'success',
      data: { ticket },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, adminNote } = req.body;

    // Only admin can update ticket status
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized to perform this action",
      });
    }

    const ticket = await Ticket.findByPk(ticketId, {
      include: [{ model: Draw, as: "Draw" }],
    });

    if (!ticket) {
      return res.status(404).json({
        status: "error",
        message: "Ticket not found",
      });
    }

    // Update ticket status
    if (status === "accepted") {
      ticket.status = "active";
      ticket.paymentStatus = "completed";
    } else if (status === "declined") {
      ticket.status = "declined";
      ticket.paymentStatus = "failed";
    }

    if (adminNote) {
      ticket.adminNote = adminNote;
    }

    await ticket.save();

    // Track ticket status update
    await activityTracker.trackTicketActivity(
      'Ticket Status Updated',
      `Ticket status updated to ${status} for draw: ${ticket.Draw.title}`,
      req.user.id,
      { ticketId, drawId: ticket.Draw.id }
    );

    res.status(200).json({
      status: "success",
      message: `Ticket ${status} successfully`,
      data: {
        ticket,
      },
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating ticket status",
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
          attributes: ["id", "title", "prize", "endDate", "status", "price"],
        },
        {
          model: User,
          attributes: ["id", "name", "email", "avatar"],
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({
        status: "error",
        message: "Ticket not found",
      });
    }

    // Check if user is authorized to view ticket details
    if (!req.user.isAdmin && ticket.userId !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized to view ticket details",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        ticket,
      },
    });
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching ticket details",
    });
  }
};
