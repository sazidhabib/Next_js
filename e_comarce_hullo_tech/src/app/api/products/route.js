import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Product } from '@/lib/db';
import { verifyAdmin } from '@/lib/api-auth';
import { products as seedProducts } from '../../../../db/seedData';

let memoryProducts = [...seedProducts];

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const subSubcategory = searchParams.get('subSubcategory');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    if (!Product) {
      let filtered = [...memoryProducts];
      if (category) filtered = filtered.filter(p => p.category === category);
      if (subcategory) filtered = filtered.filter(p => p.subcategory === subcategory);
      if (subSubcategory) filtered = filtered.filter(p => p.subSubcategory === subSubcategory);
      if (featured !== null) filtered = filtered.filter(p => p.featured === (featured === 'true'));
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q)));
      }
      filtered.sort((a, b) => b.id - a.id);
      return NextResponse.json({ success: true, data: filtered });
    }

    try {
      const where = {};
      if (category) where.category = category;
      if (subcategory) where.subcategory = subcategory;
      if (subSubcategory) where.subSubcategory = subSubcategory;
      if (featured !== null) where.featured = featured === 'true';
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      const products = await Product.findAll({ where, order: [['id', 'DESC']] });
      const data = products.map(p => p.toJSON ? p.toJSON() : p);
      return NextResponse.json({ success: true, data });
    } catch (dbErr) {
      console.warn('⚠️ DB query error during products GET:', dbErr.message);
      let filtered = [...memoryProducts];
      if (category) filtered = filtered.filter(p => p.category === category);
      if (subcategory) filtered = filtered.filter(p => p.subcategory === subcategory);
      if (subSubcategory) filtered = filtered.filter(p => p.subSubcategory === subSubcategory);
      if (featured !== null) filtered = filtered.filter(p => p.featured === (featured === 'true'));
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => (p.name && p.name.toLowerCase().includes(q)));
      }
      filtered.sort((a, b) => b.id - a.id);
      return NextResponse.json({ success: true, data: filtered });
    }
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ success: true, data: memoryProducts });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const {
      name,
      slug,
      price,
      regularPrice,
      category,
      subcategory,
      subSubcategory,
      image,
      images,
      specs,
      specifications,
      description,
      featured,
      brand,
      model,
      stock,
      warranty
    } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ success: false, message: 'Name, price, and category are required' }, { status: 400 });
    }

    const finalSlug = slug && slug.trim() !== '' ? slug.trim() : slugify(name);

    if (!Product) {
      const newProduct = {
        id: memoryProducts.length > 0 ? Math.max(...memoryProducts.map(p => p.id)) + 1 : 1,
        name,
        slug: finalSlug,
        price: parseFloat(price),
        regularPrice: regularPrice ? parseFloat(regularPrice) : null,
        category,
        subcategory,
        subSubcategory,
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
      memoryProducts.unshift(newProduct);
      return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    }

    try {
      const product = await Product.create({
        name,
        slug: finalSlug,
        price,
        regularPrice,
        category,
        subcategory,
        subSubcategory,
        image,
        images,
        specs,
        specifications,
        description,
        featured,
        brand,
        model,
        stock,
        warranty
      });
      const data = product.toJSON ? product.toJSON() : product;
      return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (dbErr) {
      console.warn('⚠️ DB write error during products POST:', dbErr.message);
      const newProduct = {
        id: memoryProducts.length > 0 ? Math.max(...memoryProducts.map(p => p.id)) + 1 : 1,
        name,
        slug: finalSlug,
        price: parseFloat(price),
        regularPrice: regularPrice ? parseFloat(regularPrice) : null,
        category,
        subcategory,
        subSubcategory,
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
      memoryProducts.unshift(newProduct);
      return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    }
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
