const { User } = require('./models');
const sequelize = require('./db/database');
const { Op } = require('sequelize');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'isAdmin'],
            where: {
                [Op.or]: [
                    { isAdmin: false },
                    { isAdmin: null }
                ]
            }
        });
        console.log("Non-admin users:", JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

checkUsers();
