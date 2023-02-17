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
  foreignKey: 'category_id'
});

Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// Products and Product Options
Product.hasMany(ProductOption, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
});

ProductOption.belongsTo(Product, {
  foreignKey: 'product_id'
});

// Product Options, Options, and Option Groups
ProductOption.belongsTo(Option, {
  foreignKey: 'option_id'
});

Option.hasMany(ProductOption, {
  foreignKey: 'option_id'
});

ProductOption.belongsTo(OptionGroup, {
  foreignKey: 'option_group_id'
});

OptionGroup.hasMany(ProductOption, {
  foreignKey: 'option_group_id'
})

Option.belongsTo(OptionGroup, {
  foreignKey: 'option_group_id',
  onDelete: 'CASCADE'
});

OptionGroup.hasMany(Option, {
  foreignKey: 'option_group_id',
  onDelete: 'CASCADE'
});

// Options and Products
Option.belongsToMany(Product, {
  through: ProductOption,
  as: 'product_with_option',
  foreignKey: 'option_id'
});

Product.belongsToMany(Option, {
  through: ProductOption,
  as: 'product_with_option',
  foreignKey: 'product_id'
});

// Orders, Users, and Order Items
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