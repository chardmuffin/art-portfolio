const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem')
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
const ProductVariant = require('./ProductVariant')

// Products belong to Categories
Product.belongsTo(Category, {
  foreignKey: 'category_id'
})

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id'
})

// Products belong to many Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id'
})

// Tags belong to many Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id'
})

Product.hasMany(ProductVariant, {
  foreignKey: 'product_id',
});

User.hasMany(Order, {
  foreignKey: 'order_id'
});

Order.belongsTo(User, {
  foreignKey: 'order_id'
})

Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id'
});

module.exports = { User, Order, OrderItem, Product, Category, Tag, ProductTag, ProductVariant };