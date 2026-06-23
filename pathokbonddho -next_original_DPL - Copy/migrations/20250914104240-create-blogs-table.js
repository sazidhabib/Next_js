// In your existing migration file
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      publishDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      author: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add unique constraint properly
    await queryInterface.addIndex('blogs', ['title'], {
      unique: true,
      name: 'blogs_title_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('blogs');
  }
};