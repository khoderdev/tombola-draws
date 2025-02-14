const User = require('./user');
const Draw = require('./draw');
const Ticket = require('./ticket');

// Draw associations
Draw.hasMany(Ticket, { foreignKey: 'drawId', as: 'tickets' });
Ticket.belongsTo(Draw, { foreignKey: 'drawId', as: 'Draw' });

// User associations
User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// Winner association
Draw.belongsTo(User, { as: 'winner', foreignKey: 'winnerId' });

module.exports = {
  User,
  Draw,
  Ticket,
};


// const User = require('./user');
// const Draw = require('./draw');
// const Ticket = require('./ticket');

// // Associations
// Draw.hasMany(Ticket);
// Ticket.belongsTo(Draw);

// User.hasMany(Ticket);
// Ticket.belongsTo(User);

// // Winner association
// Draw.belongsTo(User, { as: 'winner', foreignKey: 'winnerId' });

// module.exports = {
//   User,
//   Draw,
//   Ticket,
// };



// const User = require('./User');
// const Draw = require('./Draw');
// const Ticket = require('./Ticket');

// // User associations
// User.hasMany(Ticket, { foreignKey: 'userId' });
// Ticket.belongsTo(User, { foreignKey: 'userId' });

// // Draw associations
// Draw.hasMany(Ticket, { foreignKey: 'drawId' });
// Ticket.belongsTo(Draw, { foreignKey: 'drawId' });

// // Winner association
// Draw.belongsTo(User, { as: 'winner', foreignKey: 'winnerId' });

// module.exports = {
//   User,
//   Draw,
//   Ticket,
// };
