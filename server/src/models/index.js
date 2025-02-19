const User = require("./User");
const Draw = require("./Draw");
const Ticket = require("./Ticket");
const Activity = require("./Activity");

// Draw associations
Draw.hasMany(Ticket, { foreignKey: "drawId", as: "tickets" });
Ticket.belongsTo(Draw, { foreignKey: "drawId", as: "Draw" });

// User associations
User.hasMany(Ticket, { foreignKey: "userId", as: "tickets" });
Ticket.belongsTo(User, { foreignKey: "userId", as: "User" });

// Activity associations
User.hasMany(Activity, { foreignKey: "userId" });
Activity.belongsTo(User, { foreignKey: "userId" });

// Winner association
Draw.belongsTo(User, { as: "winner", foreignKey: "winnerId" });

module.exports = {
  User,
  Draw,
  Ticket,
  Activity,
};
