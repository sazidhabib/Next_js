// add-popup-columns.js
// Run once: node add-popup-columns.js
// Adds popupAutoCloseSeconds and popupMaxShowCount columns to the ads table

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const sequelize = require('./db/database');

async function addPopupColumns() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected.');

        const queryInterface = sequelize.getQueryInterface();

        // Check existing columns
        const tableDescription = await queryInterface.describeTable('ads');

        if (!tableDescription.popupAutoCloseSeconds) {
            await queryInterface.addColumn('ads', 'popupAutoCloseSeconds', {
                type: require('sequelize').DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
            });
            console.log('✅ Added column: popupAutoCloseSeconds');
        } else {
            console.log('⏭️  Column popupAutoCloseSeconds already exists.');
        }

        if (!tableDescription.popupMaxShowCount) {
            await queryInterface.addColumn('ads', 'popupMaxShowCount', {
                type: require('sequelize').DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
            });
            console.log('✅ Added column: popupMaxShowCount');
        } else {
            console.log('⏭️  Column popupMaxShowCount already exists.');
        }

        console.log('\n🎉 Migration complete! You can delete this file now.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

addPopupColumns();
