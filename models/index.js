// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// associations

Product.belongsTo(Category, {
  foreignKey: 'catgory_id'
});

Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

Product.belongsToMany(Tag, {
  through: {
    model: ProductTag,
    unique: false,
  },
  // define alias when data is retrieved
 // as: 'product_tag'
});

Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
    unique: false,
  },
//   // define alias when data is retrieved
//   as: 'tag_products'
});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
