'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Step 1: Rename the column to a temporary name
      await queryInterface.sequelize.query(
        `ALTER TABLE "Tickets" RENAME COLUMN "UserId" TO "userId_temp";`
      );

      // Step 2: Create the new column with correct case
      await queryInterface.addColumn('Tickets', 'userId', {
        type: Sequelize.UUID,
        allowNull: true
      });

      // Step 3: Copy data from temp column
      await queryInterface.sequelize.query(
        `UPDATE "Tickets" SET "userId" = "userId_temp";`
      );

      // Step 4: Drop the temporary column
      await queryInterface.removeColumn('Tickets', 'userId_temp');

      // Step 5: Add foreign key constraint with correct case
      await queryInterface.addConstraint('Tickets', {
        fields: ['userId'],
        type: 'foreign key',
        name: 'tickets_userid_fkey',
        references: {
          table: 'Users',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint('Tickets', 'tickets_userid_fkey');
      await queryInterface.renameColumn('Tickets', 'userId', 'UserId');
    } catch (error) {
      console.error('Migration rollback failed:', error);
      throw error;
    }
  }
};
