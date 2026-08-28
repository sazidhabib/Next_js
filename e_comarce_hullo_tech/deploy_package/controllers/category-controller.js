const { Category } = require('../models');
const { categories: seedCategories } = require('../db/seedData');

// Fallback in-memory categories list in case DB is not available
let fallbackCategories = [...seedCategories];

const getCategories = async (req, res) => {
  try {
    if (!Category) {
      return res.json({ success: true, data: fallbackCategories });
    }
    try {
      const categories = await Category.findAll({ order: [['id', 'ASC']] });
      return res.json({ success: true, data: categories });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during getCategories, using fallback categories:', dbError.message);
      return res.json({ success: true, data: fallbackCategories });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, icon, slug, image } = req.body;

    if (!Category) {
      const newCategory = {
        id: fallbackCategories.length > 0 ? Math.max(...fallbackCategories.map(c => c.id)) + 1 : 1,
        name,
        icon,
        slug,
        image
      };
      fallbackCategories.push(newCategory);
      return res.status(201).json({ success: true, data: newCategory });
    }

    try {
      const category = await Category.create({ name, icon, slug, image });
      return res.status(201).json({ success: true, data: category });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during createCategory, creating in fallback categories:', dbError.message);
      const newCategory = {
        id: fallbackCategories.length > 0 ? Math.max(...fallbackCategories.map(c => c.id)) + 1 : 1,
        name,
        icon,
        slug,
        image
      };
      fallbackCategories.push(newCategory);
      return res.status(201).json({ success: true, data: newCategory });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, slug, image } = req.body;

    if (!Category) {
      const categoryIdx = fallbackCategories.findIndex(c => c.id === parseInt(id));
      if (categoryIdx === -1) {
        return res.status(404).json({ success: false, message: 'Category not found (fallback mode)' });
      }
      fallbackCategories[categoryIdx] = {
        ...fallbackCategories[categoryIdx],
        name: name !== undefined ? name : fallbackCategories[categoryIdx].name,
        icon: icon !== undefined ? icon : fallbackCategories[categoryIdx].icon,
        slug: slug !== undefined ? slug : fallbackCategories[categoryIdx].slug,
        image: image !== undefined ? image : fallbackCategories[categoryIdx].image
      };
      return res.json({ success: true, data: fallbackCategories[categoryIdx] });
    }

    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      category.name = name || category.name;
      category.icon = icon || category.icon;
      category.slug = slug || category.slug;
      category.image = image || category.image;

      await category.save();
      return res.json({ success: true, data: category });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during updateCategory, updating fallback categories:', dbError.message);
      const categoryIdx = fallbackCategories.findIndex(c => c.id === parseInt(id));
      if (categoryIdx === -1) {
        return res.status(404).json({ success: false, message: 'Category not found (fallback mode)' });
      }
      fallbackCategories[categoryIdx] = {
        ...fallbackCategories[categoryIdx],
        name: name !== undefined ? name : fallbackCategories[categoryIdx].name,
        icon: icon !== undefined ? icon : fallbackCategories[categoryIdx].icon,
        slug: slug !== undefined ? slug : fallbackCategories[categoryIdx].slug,
        image: image !== undefined ? image : fallbackCategories[categoryIdx].image
      };
      return res.json({ success: true, data: fallbackCategories[categoryIdx] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Category) {
      const categoryIdx = fallbackCategories.findIndex(c => c.id === parseInt(id));
      if (categoryIdx === -1) {
        return res.status(404).json({ success: false, message: 'Category not found (fallback mode)' });
      }
      fallbackCategories.splice(categoryIdx, 1);
      return res.json({ success: true, message: 'Category deleted successfully (fallback mode)' });
    }

    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      await category.destroy();
      return res.json({ success: true, message: 'Category deleted successfully' });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during deleteCategory, deleting from fallback categories:', dbError.message);
      const categoryIdx = fallbackCategories.findIndex(c => c.id === parseInt(id));
      if (categoryIdx === -1) {
        return res.status(404).json({ success: false, message: 'Category not found (fallback mode)' });
      }
      fallbackCategories.splice(categoryIdx, 1);
      return res.json({ success: true, message: 'Category deleted successfully (fallback mode)' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
