const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Order extends Model {}

// Order has many OrderDetail
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      references: {
        model: 'user',
        key: 'id',
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },

    // TODO make a distinct model for addresses
    address: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'order'
  }
);

module.exports = Order;