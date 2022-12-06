const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class CategoriesModel extends Model {}
    
CategoriesModel.init({
    name: DataTypes.STRING,
    rarity: DataTypes.INTEGER,
    picture: DataTypes.STRING(150000),
    points: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
}, { 
    sequelize: sequelizeCon, 
    schema: 'myHoard',
    modelName: 'categories'
});


module.exports = { CategoriesModel };