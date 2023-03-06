const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ProductOption extends Model {}

// ProductOption is the intersection of a particular product (tshirt) with option(s) (x-large, red, cotton)
ProductOption.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    price_difference: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'id',
      }
    },
    option_id_1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'option',
        key: 'id'
      }
    },
    option_id_2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'option',
        key: 'id'
      }
    },
    option_id_3: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'option',
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
    indexes: [{ unique: true, fields: ['product_id', 'option_id_1', 'option_id_2', 'option_id_3'] }]
  }
);

module.exports = ProductOption;