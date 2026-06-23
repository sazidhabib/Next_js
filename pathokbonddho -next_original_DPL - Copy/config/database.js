// config/database.js
const syncOptions = {
    development: {
        force: false,
        alter: false
    },
    test: {
        force: true
    },
    production: {
        force: false,
        alter: false
    }
};

const getSyncOptions = () => {
    return syncOptions[process.env.NODE_ENV || 'development'];
};

module.exports = {
    syncOptions: getSyncOptions(),
    getSyncOptions
};