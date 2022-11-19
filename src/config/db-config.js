const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelizeCon = new Sequelize(process.env.DB_URI, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

module.exports = { sequelizeCon };