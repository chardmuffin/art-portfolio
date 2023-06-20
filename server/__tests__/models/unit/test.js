const { Category, OptionGroup, Option, Product, ProductOption, Image } = require('../../../models');
const sequelize = require('../../../config/connection');

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // Establish the database connection before running the tests
});

afterAll(async () => {
  await sequelize.close(); // Close the database connection after running the tests
});

describe('Category model', () => {
  beforeEach(async () => {
    await Category.destroy({ where: {} });
  });

  it('should create a new category', async () => {
    const categoryData = {
      name: 'Test Category'
    };
    const category = await Category.create(categoryData);

    expect(category).toHaveProperty('id');
    expect(category.name).toBe(categoryData.name);
  });

  it('should fetch all categories', async () => {
    const categoryData1 = {
      name: 'Category 1'
    };
    const categoryData2 = {
      name: 'Category 2'
    };
  
    await Category.bulkCreate([categoryData1, categoryData2]);
  
    const categories = await Category.findAll();
  
    expect(categories).toHaveLength(2);
  
    // Find the categories by their names
    const category1 = categories.find(category => category.name === categoryData1.name);
    const category2 = categories.find(category => category.name === categoryData2.name);
  
    // Validate the first category
    expect(category1).toHaveProperty('id');
    expect(category1.name).toBe(categoryData1.name);
  
    // Validate the second category
    expect(category2).toHaveProperty('id');
    expect(category2.name).toBe(categoryData2.name);
  });
});

describe('OptionGroup model', () => {
  beforeEach(async () => {
    await OptionGroup.destroy({ where: {} });
  });

  it('should create a new option group', async () => {
    const optionGroupData = {
      name: 'Size'
    };
    const optionGroup = await OptionGroup.create(optionGroupData);

    expect(optionGroup).toHaveProperty('id');
    expect(optionGroup.name).toBe(optionGroupData.name);
  });

  it('should fetch all option groups', async () => {
    const optionGroupData1 = {
      name: 'Size'
    };
    const optionGroupData2 = {
      name: 'Color'
    };
  
    await OptionGroup.bulkCreate([optionGroupData1, optionGroupData2]);
  
    const optionGroups = await OptionGroup.findAll();
  
    expect(optionGroups).toHaveLength(2);
  
    // Find the option groups by their names
    const optionGroup1 = optionGroups.find(group => group.name === optionGroupData1.name);
    const optionGroup2 = optionGroups.find(group => group.name === optionGroupData2.name);
  
    // Validate the first option group
    expect(optionGroup1).toHaveProperty('id');
    expect(optionGroup1.name).toBe(optionGroupData1.name);
  
    // Validate the second option group
    expect(optionGroup2).toHaveProperty('id');
    expect(optionGroup2.name).toBe(optionGroupData2.name);
  });
  
});

describe('Option model', () => {
  beforeEach(async () => {
    await Option.destroy({ where: {} });
    await OptionGroup.destroy({ where: {} });
  });

  it('should create a new option', async () => {
    const optionGroupData = {
      name: 'Size'
    };
    const optionData = {
      name: 'Small',
      option_group_id: 1 // Provide the corresponding option_group_id here
    };

    const optionGroup = await OptionGroup.create(optionGroupData);
    optionData.option_group_id = optionGroup.id;

    const option = await Option.create(optionData);

    expect(option).toHaveProperty('id');
    expect(option.name).toBe(optionData.name);
    expect(option.option_group_id).toBe(optionData.option_group_id);
  });

  it('should fetch all options', async () => {
    const optionGroupData = {
      name: 'Size'
    };
    const optionData1 = {
      name: 'Small',
      option_group_id: 1 // Provide the corresponding option_group_id here
    };
    const optionData2 = {
      name: 'Medium',
      option_group_id: 1 // Provide the corresponding option_group_id here
    };

    const optionGroup = await OptionGroup.create(optionGroupData);
    optionData1.option_group_id = optionGroup.id;
    optionData2.option_group_id = optionGroup.id;

    await Option.bulkCreate([optionData1, optionData2]);

    const options = await Option.findAll();

    expect(options).toHaveLength(2);

    // Find the options by their names
    const option1 = options.find(option => option.name === optionData1.name);
    const option2 = options.find(option => option.name === optionData2.name);

    // Validate the first option
    expect(option1).toHaveProperty('id');
    expect(option1.name).toBe(optionData1.name);
    expect(option1.option_group_id).toBe(optionData1.option_group_id);

    // Validate the second option
    expect(option2).toHaveProperty('id');
    expect(option2.name).toBe(optionData2.name);
    expect(option2.option_group_id).toBe(optionData2.option_group_id);
  });
});

describe('Product model', () => {
  beforeEach(async () => {
    await ProductOption.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Option.destroy({ where: {} });
    await OptionGroup.destroy({ where: {} });
    await Category.destroy({ where: {} });

    // Create categories before creating products
    const categoryData1 = {
      name: 'Category 1'
    };

    const categoryData2 = {
      name: 'Category 2'
    };

    await Category.bulkCreate([categoryData1, categoryData2]);
  });

  it('should create a new product', async () => {
    const productData = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 9.99,
      stock: 10,
      category_id: 1
    };

    const product = await Product.create(productData);

    expect(product).toHaveProperty('id');
    expect(product.name).toBe(productData.name);
    expect(product.description).toBe(productData.description);
    expect(product.price).toBe(productData.price);
    expect(product.stock).toBe(productData.stock);
    expect(product.category_id).toBe(productData.category_id);
  });

  it('should fetch all products', async () => {
    const productData1 = {
      name: 'Product 1',
      description: 'This is product 1',
      price: 19.99,
      stock: 5,
      category_id: 1
    };

    const productData2 = {
      name: 'Product 2',
      description: 'This is product 2',
      price: 14.99,
      stock: 3,
      category_id: 2
    };

    await Product.bulkCreate([productData1, productData2]);

    const products = await Product.findAll();

    expect(products).toHaveLength(2);

    // Validate the first product
    expect(products[0]).toHaveProperty('id');
    expect(products[0].name).toBe(productData1.name);
    expect(products[0].description).toBe(productData1.description);
    expect(products[0].price).toBe(productData1.price);
    expect(products[0].stock).toBe(productData1.stock);
    expect(products[0].category_id).toBe(productData1.category_id);

    // Validate the second product
    expect(products[1]).toHaveProperty('id');
    expect(products[1].name).toBe(productData2.name);
    expect(products[1].description).toBe(productData2.description);
    expect(products[1].price).toBe(productData2.price);
    expect(products[1].stock).toBe(productData2.stock);
    expect(products[1].category_id).toBe(productData2.category_id);
  });
});

describe('ProductOption model', () => {
  beforeEach(async () => {
    await ProductOption.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Option.destroy({ where: {} });
    await OptionGroup.destroy({ where: {} });
    await Category.destroy({ where: {} });

    // Create categories before creating products
    const categoryData1 = {
      name: 'Category 1'
    };

    const categoryData2 = {
      name: 'Category 2'
    };

    await Category.bulkCreate([categoryData1, categoryData2]);
  });

  it('should create a new product option', async () => {
    // Create the necessary data for the product option
    const productData = {
      name: 'Test Product',
      description: 'Test Product Description',
      price: 9.99,
      category_id: 1,
    };

    const optionGroupData = {
      name: 'Size',
    };

    const optionData = {
      name: 'Small',
      option_group_id: 1,
    };

    // Create an option group
    const optionGroup = await OptionGroup.create(optionGroupData);

    // Create an option associated with the option group
    const option = await Option.create(optionData);

    // Create a product
    const product = await Product.create(productData);

    // Create the product option using the product, option, and option group
    const productOptionData = {
      price_difference: 2.99,
      stock: 10,
      img: 'product-img.jpg',
      product_id: product.id,
      option_id_1: option.id,
      option_id_2: null,
      option_id_3: null,
    };

    const productOption = await ProductOption.create(productOptionData);

    // Validate the created product option
    expect(productOption).toHaveProperty('id');
    expect(productOption.price_difference).toBe(productOptionData.price_difference);
    expect(productOption.stock).toBe(productOptionData.stock);
    expect(productOption.img).toBe(productOptionData.img);
    expect(productOption.product_id).toBe(product.id);
    expect(productOption.option_id_1).toBe(option.id);
    expect(productOption.option_id_2).toBeNull();
    expect(productOption.option_id_3).toBeNull();
  });

  it('should fetch all product options', async () => {
    // Create the necessary data for the product options
    const productData = {
      name: 'Test Product',
      description: 'Test Product Description',
      price: 9.99,
      category_id: 1,
    };

    const optionGroupData = {
      name: 'Size',
    };

    const optionData = {
      name: 'Small',
      option_group_id: 1,
    };

    // Create a product and an option group
    const product = await Product.create(productData);
    const optionGroup = await OptionGroup.create(optionGroupData);

    // Create options associated with the option group
    const option1 = await Option.create(optionData);
    const option2 = await Option.create({ ...optionData, name: 'Medium' });

    // Create multiple product options using different options
    const productOptionData1 = {
      price_difference: 2.99,
      stock: 10,
      img: 'product-img1.jpg',
      product_id: product.id,
      option_id_1: option1.id,
      option_id_2: null,
      option_id_3: null,
    };

    const productOptionData2 = {
      price_difference: 3.99,
      stock: 5,
      img: 'product-img2.jpg',
      product_id: product.id,
      option_id_1: option2.id,
      option_id_2: null,
      option_id_3: null,
    };

    await ProductOption.bulkCreate([productOptionData1, productOptionData2]);

    // Fetch all product options
    const productOptions = await ProductOption.findAll();

    // Validate the fetched product options
    expect(productOptions).toHaveLength(2);

    // Validate the first product option
    expect(productOptions[0]).toHaveProperty('id');
    expect(productOptions[0].price_difference).toBe(productOptionData1.price_difference);
    expect(productOptions[0].stock).toBe(productOptionData1.stock);
    expect(productOptions[0].img).toBe(productOptionData1.img);
    expect(productOptions[0].product_id).toBe(product.id);
    expect(productOptions[0].option_id_1).toBe(option1.id);
    expect(productOptions[0].option_id_2).toBeNull();
    expect(productOptions[0].option_id_3).toBeNull();

    // Validate the second product option
    expect(productOptions[1]).toHaveProperty('id');
    expect(productOptions[1].price_difference).toBe(productOptionData2.price_difference);
    expect(productOptions[1].stock).toBe(productOptionData2.stock);
    expect(productOptions[1].img).toBe(productOptionData2.img);
    expect(productOptions[1].product_id).toBe(product.id);
    expect(productOptions[1].option_id_1).toBe(option2.id);
    expect(productOptions[1].option_id_2).toBeNull();
    expect(productOptions[1].option_id_3).toBeNull();
  });
});
