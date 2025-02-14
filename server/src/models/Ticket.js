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
    type: DataTypes.ENUM('active', 'won', 'lost'),
    defaultValue: 'active',
  },
});

module.exports = Ticket;



// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// class Ticket extends Model {}

// Ticket.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     number: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     price: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('active', 'used'),
//       defaultValue: 'active',
//       allowNull: false,
//     },
//     purchaseDate: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW,
//     },
//     userId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'Users',
//         key: 'id'
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'CASCADE'
//     },
//     drawId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'Draws',
//         key: 'id'
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'CASCADE'
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Ticket',
//     tableName: 'Tickets',
//     timestamps: true,
//   }
// );

// module.exports = Ticket;
