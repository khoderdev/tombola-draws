const User = require("./user");
const Draw = require("./draw");
const Ticket = require("./ticket");

// Draw associations
Draw.hasMany(Ticket, { foreignKey: "drawId", as: "tickets" });
Ticket.belongsTo(Draw, { foreignKey: "drawId", as: "Draw" });

// User associations
User.hasMany(Ticket, { foreignKey: "userId", as: "tickets" });
Ticket.belongsTo(User, { foreignKey: "userId", as: "User" });

// Winner association
Draw.belongsTo(User, { as: "winner", foreignKey: "winnerId" });

module.exports = {
  User,
  Draw,
  Ticket,
};
