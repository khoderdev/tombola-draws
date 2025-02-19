const { createActivity } = require('../controllers/activityController');

const activityTracker = {
  async trackUserActivity(title, description, userId, metadata = {}) {
    return createActivity(title, 'USER', description, userId, metadata);
  },

  async trackDrawActivity(title, description, userId = null, metadata = {}) {
    return createActivity(title, 'DRAW', description, userId, metadata);
  },

  async trackTicketActivity(title, description, userId, metadata = {}) {
    return createActivity(title, 'TICKET', description, userId, metadata);
  },

  async trackSystemActivity(title, description, metadata = {}) {
    return createActivity(title, 'SYSTEM', description, null, metadata);
  }
};

module.exports = activityTracker;
