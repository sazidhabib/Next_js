// utils/databaseSync.js
const safeSync = async (sequelize, options = {}) => {
    try {
        const queryInterface = sequelize.getQueryInterface();

        // Check if blogs table exists
        const tableExists = await queryInterface.showAllTables()
            .then(tables => tables.includes('blogs'));

        if (!tableExists) {
            console.log('Blogs table does not exist, creating...');
            await sequelize.sync(options);
            return true;
        }

        console.log('Database tables already exist, skipping auto-sync');
        return false;

    } catch (error) {
        console.error('Database sync failed:', error);
        throw error;
    }
};

module.exports = safeSync;