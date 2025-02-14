'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Step 1: Drop the existing column if it exists
      try {
        await queryInterface.removeColumn('Tickets', 'drawId');
      } catch (error) {
        // Column might not exist, that's okay
      }
      
      // Step 2: Add the column as nullable
      await queryInterface.addColumn('Tickets', 'drawId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Draws',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });

      // Step 3: Get the first draw
      const [draws] = await queryInterface.sequelize.query(
        `SELECT id FROM "Draws" ORDER BY "createdAt" ASC LIMIT 1;`
      );
      
      if (draws.length > 0) {
        const drawId = draws[0].id;
        
        // Step 4: Update all existing tickets with the draw ID
        await queryInterface.sequelize.query(
          `UPDATE "Tickets" SET "drawId" = :drawId WHERE "drawId" IS NULL`,
          {
            replacements: { drawId }
          }
        );
      }

      // Step 5: Make the column NOT NULL
      await queryInterface.changeColumn('Tickets', 'drawId', {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Draws',
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
    await queryInterface.removeColumn('Tickets', 'drawId');
  }
};
