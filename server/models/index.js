const User = require('./User');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
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

// Products and Tags
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id'
});

Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id'
});

// Products and Product Options
Product.hasMany(ProductOption, {
  foreignKey: 'product_id',
});

ProductOption.belongsTo(Product, {
  foreignKey: 'product_id'
});

// Product Options and Option Groups
ProductOption.belongsTo(Option, {
  foreignKey: 'option_id'
});

ProductOption.belongsTo(OptionGroup, {
  foreignKey: 'option_group_id'
});

Option.belongsTo(OptionGroup, {
  foreignKey: 'option_group_id'
});

OptionGroup.hasMany(Option, {
  foreignKey: 'option_group_id'
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
  Tag,
  ProductTag,
  ProductOption,
  Option,
  OptionGroup
};