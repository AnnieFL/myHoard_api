const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class UsersModel extends Model {}
    
UsersModel.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: DataTypes.STRING,
    permissions: DataTypes.ARRAY(DataTypes.STRING),
    active: DataTypes.BOOLEAN
}, { 
    sequelize: sequelizeCon, 
    schema: 'myHoard',
    modelName: 'users'
});


module.exports = { UsersModel };