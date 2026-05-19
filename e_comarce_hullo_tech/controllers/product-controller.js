const { Product } = require('../models');

const getProducts = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const where = {};
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured === 'true';

    const products = await Product.findAll({ where, order: [['id', 'DESC']] });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ where: { slug } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, slug, price, category, image, images, specs, description, featured, brand, model, stock } = req.body;
    const product = await Product.create({
      name, slug, price, category, image, images, specs, description, featured, brand, model, stock
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, price, category, image, images, specs, description, featured, brand, model, stock } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.name = name !== undefined ? name : product.name;
    product.slug = slug !== undefined ? slug : product.slug;
    product.price = price !== undefined ? price : product.price;
    product.category = category !== undefined ? category : product.category;
    product.image = image !== undefined ? image : product.image;
    product.images = images !== undefined ? images : product.images;
    product.specs = specs !== undefined ? specs : product.specs;
    product.description = description !== undefined ? description : product.description;
    product.featured = featured !== undefined ? featured : product.featured;
    product.brand = brand !== undefined ? brand : product.brand;
    product.model = model !== undefined ? model : product.model;
    product.stock = stock !== undefined ? stock : product.stock;

    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.destroy();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
