const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Option extends Model {}

// Option model contains options for each product
// (e.g. small, medium, large, paperback, hardcover, 5x7 print, 11x20 print, 11x20 original, etc.)
Option.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    option_group_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'option_group',
        key: 'id',
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'option',
  }
);

module.exports = Option;