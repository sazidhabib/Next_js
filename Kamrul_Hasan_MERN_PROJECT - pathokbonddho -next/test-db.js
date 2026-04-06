// test-db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'saziddb',       // database name
    'sazid',      // MySQL username
    'sazid@123',      // MySQL password
    {
        host: '192.168.163.99',  // or your host from SQLyog
        port: 3306,         // check SQLyog port (default = 3306)
        dialect: 'mysql',
    }
);

sequelize.authenticate()
    .then(() => console.log('✅ Database connected successfully'))
    .catch(err => console.error('❌ Connection failed:', err));
