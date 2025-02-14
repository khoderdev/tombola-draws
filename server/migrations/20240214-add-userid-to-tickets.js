'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Step 1: Drop the existing column
      await queryInterface.removeColumn('Tickets', 'userId');
      
      // Step 2: Add the column as nullable
      await queryInterface.addColumn('Tickets', 'userId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });

      // Step 3: Get the first admin user
      const [users] = await queryInterface.sequelize.query(
        `SELECT id FROM "Users" WHERE role = 'admin' LIMIT 1;`
      );
      
      if (users.length > 0) {
        const adminId = users[0].id;
        
        // Step 4: Update all existing tickets with the admin user ID
        await queryInterface.sequelize.query(
          `UPDATE "Tickets" SET "userId" = :adminId WHERE "userId" IS NULL`,
          {
            replacements: { adminId }
          }
        );
      }

      // Step 5: Make the column NOT NULL
      await queryInterface.changeColumn('Tickets', 'userId', {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tickets', 'userId');
  }
};
