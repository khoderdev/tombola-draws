const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Draw = sequelize.define(
  'Draw',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prize: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    maxTickets: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active',
    },
    winnerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    winningTicketId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        fields: ['status'],
      },
      {
        fields: ['endDate'],
      },
    ],
  }
);

module.exports = Draw;
