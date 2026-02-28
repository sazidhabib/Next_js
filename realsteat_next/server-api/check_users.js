const pool = require('./config/db');

const checkUsers = async () => {
    try {
        const [rows] = await pool.query('SELECT id, username, email, role FROM ph_users');
        console.log('Users found:', rows);
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        process.exit();
    }
};

checkUsers();
