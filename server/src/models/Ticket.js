const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  drawId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Draws',
      key: 'id',
    },
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'declined', 'active', 'won', 'lost'),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adminNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Define associations
Ticket.associate = (models) => {
  Ticket.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'User'
  });
  
  Ticket.belongsTo(models.Draw, {
    foreignKey: 'drawId',
    as: 'Draw'
  });
};

module.exports = Ticket;
