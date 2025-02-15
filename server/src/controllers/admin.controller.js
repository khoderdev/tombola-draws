const { User, Draw, Ticket } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeDraws = await Draw.count({ where: { status: 'active' } });
    
    // Calculate total revenue by summing up (number of tickets * draw price)
    const totalRevenue = await Ticket.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Ticket.id')), 'ticketCount'],
        [sequelize.col('Draw.price'), 'drawPrice']
      ],
      include: [{ 
        model: Draw,
        as: 'Draw',
        attributes: []
      }],
      group: ['Draw.price'],
      raw: true
    }).then(results => 
      results.reduce((sum, row) => 
        sum + (parseFloat(row.drawPrice) * parseInt(row.ticketCount)), 0)
    );

    // Calculate growth rates
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

    // Calculate conversion rate
    const usersWithTickets = await User.count({
      include: [{
        model: Ticket,
        as: 'tickets',
        required: true,
      }],
    });

    const conversionRate = totalUsers > 0 ? ((usersWithTickets / totalUsers) * 100).toFixed(2) : 0;

    // Calculate last month's conversion rate for comparison
    const lastMonthUsersWithTickets = await User.count({
      include: [{
        model: Ticket,
        as: 'tickets',
        required: true,
        where: {
          createdAt: {
            [Op.lt]: new Date(),
            [Op.gte]: lastMonth,
          },
        },
      }],
    });

    const lastMonthUsers = await User.count({
      where: {
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gte]: lastMonth,
        },
      },
    });

    const lastMonthConversionRate = lastMonthUsers > 0 
      ? ((lastMonthUsersWithTickets / lastMonthUsers) * 100).toFixed(2)
      : 0;

    const conversionRateChange = (parseFloat(conversionRate) - parseFloat(lastMonthConversionRate)).toFixed(2);

    // Get recent activity
    const recentActivity = await Promise.all([
      User.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'createdAt'],
      }),
      Ticket.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'User', attributes: ['name'] },
          { model: Draw, as: 'Draw', attributes: ['title'] },
        ],
      }),
    ]);

    const activity = [
      ...recentActivity[0].map((user) => ({
        id: user.id,
        type: 'New User',
        title: `${user.name} joined`,
        description: 'New user registration',
        timestamp: user.createdAt,
      })),
      ...recentActivity[1].map((ticket) => ({
        id: ticket.id,
        type: 'Ticket Purchase',
        title: `${ticket.User.name} purchased a ticket`,
        description: `Ticket purchased for ${ticket.Draw.title}`,
        timestamp: ticket.createdAt,
      })),
    ].sort((a, b) => b.timestamp - a.timestamp);

    // Add pending tickets count to stats
    const pendingTickets = await Ticket.count({
      where: { status: 'pending' }
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        activeDraws,
        totalRevenue: totalRevenue || 0,
        userGrowth,
        drawGrowth,
        conversionRate,
        conversionRateChange,
        pendingTickets,
        recentActivity: activity.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Error in admin getStats:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching statistics',
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Ticket,
          as: 'tickets',
          attributes: ['id'],
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      data: users,
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
