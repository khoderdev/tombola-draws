const { Draw, Ticket, User } = require("../models");
const { Op } = require("sequelize");

exports.getDraws = async (req, res) => {
  try {
    console.log('🎯 getDraws: Starting process...', {
      isAuthenticated: !!req.user,
      userId: req.user?.id
    });
    
    // First, get all active draws
    let draws = await Draw.findAll({
      where: {
        status: "active",
        endDate: {
          [Op.gt]: new Date(),
        },
      },
      order: [["createdAt", "DESC"]],
    });

    // If user is authenticated, get their tickets in a single query
    let userTickets = [];
    if (req.user) {
      userTickets = await Ticket.findAll({
        where: {
          userId: req.user.id,
          drawId: draws.map(draw => draw.id)
        },
        include: [{
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email', 'avatar']
        }]
      });
      
      console.log('🎫 Found user tickets:', userTickets.length);
    }

    // Map draws and include ticket information if available
    draws = draws.map(draw => {
      const drawObj = draw.get({ plain: true });
      
      if (req.user) {
        const userTicket = userTickets.find(ticket => ticket.drawId === drawObj.id);
        console.log(`Processing draw ${drawObj.id}:`, {
          hasTicket: !!userTicket,
          ticketStatus: userTicket?.status
        });

        return {
          ...drawObj,
          hasEntered: !!userTicket,
          ticketStatus: userTicket ? 'active' : null,
          ticketId: userTicket ? userTicket.id : null,
          ticketNumber: userTicket ? userTicket.number : null,
          ticketUser: userTicket ? userTicket.User : null
        };
      } else {
        return {
          ...drawObj,
          hasEntered: false,
          ticketStatus: null,
          ticketId: null,
          ticketNumber: null,
          ticketUser: null
        };
      }
    });

    console.log('✅ Sending response with processed draws');
    res.status(200).json({
      status: "success",
      data: draws,
    });
  } catch (error) {
    console.error("❌ Error in getDraws:", {
      message: error.message,
      stack: error.stack
    });
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

    // Get winner with avatar
    const winner = await User.findByPk(winningTicket.User.id, {
      attributes: ['id', 'name', 'email', 'avatar']
    });

    res.status(200).json({
      status: "success",
      data: {
        winner,
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
    console.log('🎯 enterDraw: Starting process...');
    const { drawId } = req.params;
    const userId = req.user.id;
    console.log('📝 Request details:', { drawId, userId });

    const draw = await Draw.findByPk(drawId);
    console.log('🎲 Found draw:', draw ? {
      id: draw.id,
      title: draw.title,
      status: draw.status,
      endDate: draw.endDate
    } : 'Not found');

    if (!draw) {
      console.log('❌ Draw not found error');
      return res.status(404).json({
        status: 'error',
        message: 'Draw not found',
      });
    }

    // Check if draw is active
    console.log('🔍 Checking draw status:', { currentStatus: draw.status });
    if (draw.status !== 'active') {
      console.log('❌ Draw not active error');
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
    console.log('🎫 Checking existing ticket:', existingTicket ? {
      id: existingTicket.id,
      number: existingTicket.number,
      status: existingTicket.status
    } : 'No existing ticket');

    if (existingTicket) {
      console.log('❌ User already entered error');
      return res.status(400).json({
        status: 'error',
        message: 'You have already entered this draw',
      });
    }

    // Create ticket
    const ticketNumber = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log('🎫 Generating ticket number:', ticketNumber);
    
    const ticket = await Ticket.create({
      drawId,
      userId,
      number: ticketNumber,
    });
    console.log('✨ Created new ticket:', {
      id: ticket.id,
      number: ticket.number,
      drawId: ticket.drawId,
      userId: ticket.userId
    });

    // Fetch the created ticket with user information
    const ticketWithUser = await Ticket.findByPk(ticket.id, {
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'name', 'email', 'avatar']
      }]
    });
    console.log('👤 Fetched ticket with user:', {
      ticketId: ticketWithUser.id,
      number: ticketWithUser.number,
      userName: ticketWithUser.User.name,
      userEmail: ticketWithUser.User.email
    });

    // Get the updated draw with the new ticket
    const updatedDraw = await Draw.findByPk(drawId);
    console.log('🎲 Updated draw status:', {
      id: updatedDraw.id,
      status: updatedDraw.status
    });

    const responseData = {
      status: 'success',
      data: {
        ticket: ticketWithUser,
        hasEntered: true,
        ticketStatus: 'active',
        drawStatus: updatedDraw.status
      },
    };
    console.log('✅ Sending success response:', responseData);

    res.status(201).json(responseData);
  } catch (error) {
    console.error('❌ Error in enterDraw:', {
      message: error.message,
      stack: error.stack,
      details: error
    });
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
