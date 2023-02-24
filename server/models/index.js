const User = require('./User');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');
const Product = require('./Product');
const Category = require('./Category');
const ProductOption = require('./ProductOption');
const Option = require('./Option');
const OptionGroup = require('./OptionGroup');

// Categories and Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
});

Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// Options, Option Groups, and Product Options
OptionGroup.hasMany(Option, {
  foreignKey: 'option_group_id',
  onDelete: 'CASCADE'
});

Option.belongsTo(OptionGroup, {
  foreignKey: 'option_group_id'
});

ProductOption.belongsTo(Option, {
  foreignKey: 'option_id'
});

Option.hasMany(ProductOption, {
  foreignKey: 'option_id',
  onDelete: 'CASCADE'
});

// Products and Product Options
Product.hasMany(ProductOption, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
});

ProductOption.belongsTo(Product, {
  foreignKey: 'product_id'
});

// Orders, Users, and Order Details
User.hasMany(Order, {
  foreignKey: 'user_id'
});

Order.belongsTo(User, {
  foreignKey: 'user_id'
});

Order.hasMany(OrderDetail, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE'
});

OrderDetail.belongsTo(Order, {
  foreignKey: 'order_id'
});

OrderDetail.belongsTo(Product, {
  foreignKey: 'product_id'
});

OrderDetail.belongsTo(ProductOption, {
  foreignKey: 'product_option_id'
});

module.exports = {
  User,
  Order,
  OrderDetail,
  Product,
  Category,
  ProductOption,
  Option,
  OptionGroup
};