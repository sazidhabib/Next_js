'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('menus', 'metaTitle', {
            type: Sequelize.STRING(255),
            allowNull: true
        });

        await queryInterface.addColumn('menus', 'metaDescription', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('menus', 'metaKeywords', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('menus', 'parentId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'menus',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        await queryInterface.addColumn('menus', 'level', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        });

        await queryInterface.addColumn('menus', 'isActive', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        });

        // Add indexes
        await queryInterface.addIndex('menus', ['parentId']);
        await queryInterface.addIndex('menus', ['level']);
        await queryInterface.addIndex('menus', ['isActive']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('menus', 'metaTitle');
        await queryInterface.removeColumn('menus', 'metaDescription');
        await queryInterface.removeColumn('menus', 'metaKeywords');
        await queryInterface.removeColumn('menus', 'parentId');
        await queryInterface.removeColumn('menus', 'level');
        await queryInterface.removeColumn('menus', 'isActive');
    }
};