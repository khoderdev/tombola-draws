const { User, Draw, Ticket } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const activityTracker = require('../utils/activityTracker');

exports.getStats = async (req, res) => {
  try {
    // Basic stats
    const totalUsers = await User.count();
    const activeDraws = await Draw.count({ where: { status: 'active' } });
    
    // Calculate total revenue
    const totalRevenue = await Ticket.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('Draw.price')), 'total']
      ],
      include: [{ 
        model: Draw,
        as: 'Draw',
        attributes: []
      }],
      raw: true
    }).then(results => results[0]?.total || 0);

    // Growth calculations
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const newUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: lastMonth,
        },
      },
    });

    const userGrowth = totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(2) : 0;

    const newDraws = await Draw.count({
      where: {
        createdAt: {
          [Op.gte]: lastMonth,
        },
      },
    });

    const drawGrowth = activeDraws > 0 ? ((newDraws / activeDraws) * 100).toFixed(2) : 0;

    // Conversion rate
    const usersWithTickets = await User.count({
      include: [{
        model: Ticket,
        as: 'tickets',
        required: true,
      }],
    });

    const conversionRate = totalUsers > 0 ? ((usersWithTickets / totalUsers) * 100).toFixed(2) : 0;

    // Recent activity (simplified)
    const recentUsers = await User.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'createdAt'],
    });

    const recentTickets = await Ticket.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'User', attributes: ['name'] },
        { model: Draw, as: 'Draw', attributes: ['title'] },
      ],
    });

    const activity = [
      ...recentUsers.map((user) => ({
        id: user.id,
        type: 'New User',
        title: `${user.name} joined`,
        description: 'New user registration',
        timestamp: user.createdAt,
      })),
      ...recentTickets.map((ticket) => ({
        id: ticket.id,
        type: 'Ticket Purchase',
        title: `${ticket.User?.name || 'Unknown'} purchased a ticket`,
        description: `Ticket purchased for ${ticket.Draw?.title || 'Unknown Draw'}`,
        timestamp: ticket.createdAt,
      })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pending tickets
    const pendingTickets = await Ticket.count({
      where: { status: 'pending' }
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        activeDraws,
        totalRevenue: parseFloat(totalRevenue) || 0,
        userGrowth: parseFloat(userGrowth),
        drawGrowth: parseFloat(drawGrowth),
        conversionRate: parseFloat(conversionRate),
        conversionRateChange: 0, // Simplified for now
        pendingTickets,
        recentActivity: activity.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Error in admin getStats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt', 'avatar'],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      data: { users },
    });
  } catch (error) {
    console.error('Error in admin getUsers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching users',
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    await user.update({
      name,
      email,
      role,
    });

    // Track user update
    await activityTracker.trackUserActivity(
      'User Updated',
      `User updated: ${user.name}`,
      req.user.id,
      { userId: user.id }
    );

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Error in admin updateUser:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating user',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    await user.destroy();

    // Track user deletion
    await activityTracker.trackUserActivity(
      'User Deleted',
      `User deleted: ${user.name}`,
      req.user.id,
      { userId: user.id }
    );

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in admin deleteUser:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting user',
    });
  }
};

// Draw Management Functions
exports.getDraws = async (req, res) => {
  try {
    const draws = await Draw.findAll({
      include: [
        {
          model: Ticket,
          as: 'tickets',
          attributes: ['id'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const formattedDraws = draws.map(draw => ({
      ...draw.toJSON(),
      ticketCount: draw.tickets.length,
      tickets: undefined
    }));

    res.status(200).json({
      status: 'success',
      data: formattedDraws,
    });
  } catch (error) {
    console.error('Error in admin getDraws:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching draws',
    });
  }
};

exports.createDraw = async (req, res) => {
  try {
    const {
      title,
      prize,
      price,
      startDate,
      endDate,
      maxTickets,
      image,
    } = req.body;

    // Validate required fields
    if (!title || !prize || !price || !startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: title, prize, price, startDate, endDate',
      });
    }

    // Convert price to number if it's a string
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

    const draw = await Draw.create({
      title,
      prize,
      price: numericPrice,
      startDate,
      endDate,
      ...(maxTickets && { maxTickets: parseInt(maxTickets) }),
      ...(image && { image }),
      status: 'active',
    });

    // Track draw creation
    await activityTracker.trackDrawActivity(
      'Draw Created',
      `New draw created: ${draw.title}`,
      req.user.id,
      { drawId: draw.id }
    );

    res.status(201).json({
      status: 'success',
      data: draw,
    });
  } catch (error) {
    console.error('Error in admin createDraw:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating draw',
    });
  }
};

exports.updateDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      prize,
      price,
      startDate,
      endDate,
      maxTickets,
      image,
      status,
    } = req.body;

    const draw = await Draw.findByPk(id);

    if (!draw) {
      return res.status(404).json({
        status: 'error',
        message: 'Draw not found',
      });
    }

    // Prepare updates with type conversion
    const updates = {
      ...(title && { title }),
      ...(prize && { prize }),
      ...(price && { price: typeof price === 'string' ? parseFloat(price) : price }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(maxTickets && { maxTickets: parseInt(maxTickets) }),
      ...(image && { image }),
      ...(status && { status }),
    };

    await draw.update(updates);

    // Track draw update
    await activityTracker.trackDrawActivity(
      'Draw Updated',
      `Draw updated: ${draw.title}`,
      req.user.id,
      { drawId: draw.id }
    );

    res.status(200).json({
      status: 'success',
      data: draw,
    });
  } catch (error) {
    console.error('Error in admin updateDraw:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating draw',
    });
  }
};

exports.deleteDraw = async (req, res) => {
  try {
    const { id } = req.params;
    const draw = await Draw.findByPk(id);

    if (!draw) {
      return res.status(404).json({
        status: 'error',
        message: 'Draw not found',
      });
    }

    // Check if there are any tickets sold
    const ticketCount = await Ticket.count({ where: { drawId: id } });
    if (ticketCount > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete draw with sold tickets',
      });
    }

    await draw.destroy();

    // Track draw deletion
    await activityTracker.trackDrawActivity(
      'Draw Deleted',
      `Draw deleted: ${draw.title}`,
      req.user.id,
      { drawId: draw.id }
    );

    res.status(200).json({
      status: 'success',
      message: 'Draw deleted successfully',
    });
  } catch (error) {
    console.error('Error in admin deleteDraw:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting draw',
    });
  }
};

exports.getPendingTickets = async (req, res) => {
  try {
    const pendingTickets = await Ticket.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: Draw,
          as: 'Draw',
          attributes: ['id', 'title', 'prize', 'price'],
        },
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['purchaseDate', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      data: {
        tickets: pendingTickets,
      },
    });
  } catch (error) {
    console.error('Error fetching pending tickets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching pending tickets',
    });
  }
};
