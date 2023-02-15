const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ProductOption extends Model {}

// ProductOption is the interesection of a particular product (tshirt) with an option (x-large)
ProductOption.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    option_price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'option',
        key: 'id'
      }
    },
    option_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'option_group',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_option',
  }
);

module.exports = ProductOption;