const User = require('./User');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');
const Product = require('./Product');
const Category = require('./Category');
const ProductOption = require('./ProductOption');
const Option = require('./Option');
const OptionGroup = require('./OptionGroup');
const Image = require('./Image');

// Products and Images
Product.hasOne(Image, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
});

Image.belongsTo(Product, {
  foreignKey: 'product_id'
});

// Products and Categories
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
});

Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// Options and Option Groups
OptionGroup.hasMany(Option, {
  foreignKey: 'option_group_id',
  onDelete: 'CASCADE'
});

Option.belongsTo(OptionGroup, {
  foreignKey: 'option_group_id'
});

// Options and Product Options
ProductOption.belongsTo(Option, {
  foreignKey: 'option_id_1',
  as: 'option_1'
});

Option.hasMany(ProductOption, {
  foreignKey: 'option_id_1',
  as: 'option_1',
  onDelete: 'CASCADE'
});

ProductOption.belongsTo(Option, {
  foreignKey: 'option_id_2',
  as: 'option_2'
});

Option.hasMany(ProductOption, {
  foreignKey: 'option_id_2',
  as: 'option_2',
  onDelete: 'CASCADE'
});

ProductOption.belongsTo(Option, {
  foreignKey: 'option_id_3',
  as: 'option_3'
});

Option.hasMany(ProductOption, {
  foreignKey: 'option_id_3',
  as: 'option_3',
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
  Image,
  Category,
  ProductOption,
  Option,
  OptionGroup
};