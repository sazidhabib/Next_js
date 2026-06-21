const { Product } = require('../models');
const { products: seedProducts } = require('../db/seedData');

// Fallback in-memory products list in case DB is not available
let fallbackProducts = [...seedProducts];

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric, spaces, hyphens
    .replace(/\s+/g, '-') // replace spaces with hyphen
    .replace(/-+/g, '-') // replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // trim hyphens from ends
};

const getProducts = async (req, res) => {
  try {
    if (!Product) {
      let data = [...fallbackProducts];
      const { category, featured } = req.query;
      if (category) {
        data = data.filter(p => p.category === category);
      }
      if (featured !== undefined) {
        data = data.filter(p => p.featured === (featured === 'true'));
      }
      data.sort((a, b) => b.id - a.id);
      return res.json({ success: true, data });
    }

    try {
      const { category, featured } = req.query;
      const where = {};
      if (category) where.category = category;
      if (featured !== undefined) where.featured = featured === 'true';

      const products = await Product.findAll({ where, order: [['id', 'DESC']] });
      return res.json({ success: true, data: products });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during getProducts, using fallback products:', dbError.message);
      let data = [...fallbackProducts];
      const { category, featured } = req.query;
      if (category) {
        data = data.filter(p => p.category === category);
      }
      if (featured !== undefined) {
        data = data.filter(p => p.featured === (featured === 'true'));
      }
      data.sort((a, b) => b.id - a.id);
      return res.json({ success: true, data });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!Product) {
      const product = fallbackProducts.find(p => p.slug === slug);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found (fallback mode)' });
      }
      return res.json({ success: true, data: product });
    }

    try {
      const product = await Product.findOne({ where: { slug } });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during getProductBySlug, using fallback product:', dbError.message);
      const product = fallbackProducts.find(p => p.slug === slug);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found (fallback mode)' });
      }
      return res.json({ success: true, data: product });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, slug, price, regularPrice, category, image, images, specs, specifications, description, featured, brand, model, stock, warranty } = req.body;

    const finalSlug = slug && slug.trim() !== '' ? slug : slugify(name || '');

    if (!Product) {
      const newProduct = {
        id: fallbackProducts.length > 0 ? Math.max(...fallbackProducts.map(p => p.id)) + 1 : 1,
        name,
        slug: finalSlug,
        price: parseFloat(price),
        regularPrice: regularPrice ? parseFloat(regularPrice) : null,
        category,
        image,
        images: Array.isArray(images) ? images : [image],
        specs: Array.isArray(specs) ? specs : (specs ? specs.split(',').map(s => s.trim()) : []),
        description,
        specifications: typeof specifications === 'string' ? JSON.parse(specifications) : (specifications || {}),
        warranty,
        featured: featured === true || featured === 'true',
        brand,
        model,
        stock: stock === true || stock === 'true'
      };
      fallbackProducts.push(newProduct);
      return res.status(201).json({ success: true, data: newProduct });
    }

    try {
      const product = await Product.create({
        name, slug: finalSlug, price, regularPrice, category, image, images, specs, specifications, description, featured, brand, model, stock, warranty
      });
      return res.status(201).json({ success: true, data: product });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during createProduct, creating in fallback products:', dbError.message);
      const newProduct = {
        id: fallbackProducts.length > 0 ? Math.max(...fallbackProducts.map(p => p.id)) + 1 : 1,
        name,
        slug: finalSlug,
        price: parseFloat(price),
        regularPrice: regularPrice ? parseFloat(regularPrice) : null,
        category,
        image,
        images: Array.isArray(images) ? images : [image],
        specs: Array.isArray(specs) ? specs : (specs ? specs.split(',').map(s => s.trim()) : []),
        description,
        specifications: typeof specifications === 'string' ? JSON.parse(specifications) : (specifications || {}),
        warranty,
        featured: featured === true || featured === 'true',
        brand,
        model,
        stock: stock === true || stock === 'true'
      };
      fallbackProducts.push(newProduct);
      return res.status(201).json({ success: true, data: newProduct });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, price, regularPrice, category, image, images, specs, specifications, description, featured, brand, model, stock, warranty } = req.body;

    // Determine slug: if slug is provided and not empty, use it; else if name is provided, generate from name; else keep existing
    let finalSlug;
    if (slug !== undefined && slug !== null && slug.trim() !== '') {
      finalSlug = slug.trim();
    } else if (name !== undefined && name !== null && name.trim() !== '') {
      finalSlug = slugify(name.trim());
    } // else finalSlug remains undefined, we'll keep existing later

    if (!Product) {
      const productIdx = fallbackProducts.findIndex(p => p.id === parseInt(id));
      if (productIdx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found (fallback mode)' });
      }

      fallbackProducts[productIdx] = {
        ...fallbackProducts[productIdx],
        name: name !== undefined ? name : fallbackProducts[productIdx].name,
        slug: finalSlug !== undefined ? finalSlug : fallbackProducts[productIdx].slug,
        price: price !== undefined ? parseFloat(price) : fallbackProducts[productIdx].price,
        regularPrice: regularPrice !== undefined ? (regularPrice ? parseFloat(regularPrice) : null) : fallbackProducts[productIdx].regularPrice,
        category: category !== undefined ? category : fallbackProducts[productIdx].category,
        image: image !== undefined ? image : fallbackProducts[productIdx].image,
        images: images !== undefined ? (Array.isArray(images) ? images : [images]) : fallbackProducts[productIdx].images,
        specs: specs !== undefined ? (Array.isArray(specs) ? specs : specs.split(',').map(s => s.trim())) : fallbackProducts[productIdx].specs,
        specifications: specifications !== undefined ? (typeof specifications === 'string' ? JSON.parse(specifications) : specifications) : fallbackProducts[productIdx].specifications,
        description: description !== undefined ? description : fallbackProducts[productIdx].description,
        warranty: warranty !== undefined ? warranty : fallbackProducts[productIdx].warranty,
        featured: featured !== undefined ? (featured === true || featured === 'true') : fallbackProducts[productIdx].featured,
        brand: brand !== undefined ? brand : fallbackProducts[productIdx].brand,
        model: model !== undefined ? model : fallbackProducts[productIdx].model,
        stock: stock !== undefined ? (stock === true || stock === 'true') : fallbackProducts[productIdx].stock
      };
      return res.json({ success: true, data: fallbackProducts[productIdx] });
    }

    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      product.name = name !== undefined ? name : product.name;
      product.slug = finalSlug !== undefined ? finalSlug : product.slug;
      product.price = price !== undefined ? price : product.price;
      product.regularPrice = regularPrice !== undefined ? (regularPrice ? parseFloat(regularPrice) : null) : product.regularPrice;
      product.category = category !== undefined ? category : product.category;
      product.image = image !== undefined ? image : product.image;
      product.images = images !== undefined ? images : product.images;
      product.specs = specs !== undefined ? specs : product.specs;
      product.specifications = specifications !== undefined ? specifications : product.specifications;
      product.description = description !== undefined ? description : product.description;
      product.warranty = warranty !== undefined ? warranty : product.warranty;
      product.featured = featured !== undefined ? featured : product.featured;
      product.brand = brand !== undefined ? brand : product.brand;
      product.model = model !== undefined ? model : product.model;
      product.stock = stock !== undefined ? stock : product.stock;

      await product.save();
      return res.json({ success: true, data: product });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during updateProduct, updating fallback products:', dbError.message);
      const productIdx = fallbackProducts.findIndex(p => p.id === parseInt(id));
      if (productIdx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found (fallback mode)' });
      }

      fallbackProducts[productIdx] = {
        ...fallbackProducts[productIdx],
        name: name !== undefined ? name : fallbackProducts[productIdx].name,
        slug: finalSlug !== undefined ? finalSlug : fallbackProducts[productIdx].slug,
        price: price !== undefined ? parseFloat(price) : fallbackProducts[productIdx].price,
        regularPrice: regularPrice !== undefined ? (regularPrice ? parseFloat(regularPrice) : null) : fallbackProducts[productIdx].regularPrice,
        category: category !== undefined ? category : fallbackProducts[productIdx].category,
        image: image !== undefined ? image : fallbackProducts[productIdx].image,
        images: images !== undefined ? (Array.isArray(images) ? images : [images]) : fallbackProducts[productIdx].images,
        specs: specs !== undefined ? (Array.isArray(specs) ? specs : specs.split(',').map(s => s.trim())) : fallbackProducts[productIdx].specs,
        specifications: specifications !== undefined ? (typeof specifications === 'string' ? JSON.parse(specifications) : specifications) : fallbackProducts[productIdx].specifications,
        description: description !== undefined ? description : fallbackProducts[productIdx].description,
        warranty: warranty !== undefined ? warranty : fallbackProducts[productIdx].warranty,
        featured: featured !== undefined ? (featured === true || featured === 'true') : fallbackProducts[productIdx].featured,
        brand: brand !== undefined ? brand : fallbackProducts[productIdx].brand,
        model: model !== undefined ? model : fallbackProducts[productIdx].model,
        stock: stock !== undefined ? (stock === true || stock === 'true') : fallbackProducts[productIdx].stock
      };
      return res.json({ success: true, data: fallbackProducts[productIdx] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Product) {
      const productIdx = fallbackProducts.findIndex(p => p.id === parseInt(id));
      if (productIdx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found (fallback mode)' });
      }
      fallbackProducts.splice(productIdx, 1);
      return res.json({ success: true, message: 'Product deleted successfully (fallback mode)' });
    }

    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      await product.destroy();
      return res.json({ success: true, message: 'Product deleted successfully' });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during deleteProduct, deleting from fallback products:', dbError.message);
      const productIdx = fallbackProducts.findIndex(p => p.id === parseInt(id));
      if (productIdx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found (fallback mode)' });
      }
      fallbackProducts.splice(productIdx, 1);
      return res.json({ success: true, message: 'Product deleted successfully (fallback mode)' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
