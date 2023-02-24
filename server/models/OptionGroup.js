const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class OptionGroup extends Model {}

// OptionGroup table contains groupings for options
// (e.g. shirt sizes, color, print material, print size, etc.)
OptionGroup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'option_group',
  }
);

module.exports = OptionGroup;