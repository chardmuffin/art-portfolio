const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class OrderDetail extends Model {}

// Order detail is like a single line item on an itemized bill
OrderDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    product_option_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product_option',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'order_detail'
  }
);

module.exports = OrderDetail;