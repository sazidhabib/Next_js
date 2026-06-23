'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all indexes for blogs table
    const [indexes] = await queryInterface.sequelize.query(
      `SHOW INDEX FROM blogs WHERE Key_name LIKE 'title%' AND Key_name != 'PRIMARY'`
    );

    // Keep only the first title index, remove duplicates
    const indexesToRemove = indexes.filter((index, i) =>
      index.Key_name !== 'title' && i > 0
    );

    for (const index of indexesToRemove) {
      await queryInterface.removeIndex('blogs', index.Key_name);
    }

    console.log(`Removed ${indexesToRemove.length} duplicate indexes`);
  },

  async down(queryInterface, Sequelize) {
    // This migration cannot be reversed safely
  }
};