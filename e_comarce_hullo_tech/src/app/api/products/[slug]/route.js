import { NextResponse } from 'next/server';
import { Product, OrderItem } from '@/lib/db';
import { verifyAdmin } from '@/lib/api-auth';

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

async function findProduct(identifier) {
  if (!Product) return null;
  const isNumeric = /^\d+$/.test(identifier);
  if (isNumeric) {
    const p = await Product.findByPk(parseInt(identifier));
    if (p) return p;
  }
  return await Product.findOne({ where: { slug: identifier } });
}

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const product = await findProduct(slug);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    const data = product.toJSON ? product.toJSON() : product;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { slug } = await params;
    const product = await findProduct(slug);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      slug: newSlug,
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

    let finalSlug;
    if (newSlug !== undefined && newSlug !== null && newSlug.trim() !== '') {
      finalSlug = newSlug.trim();
    } else if (name !== undefined && name !== null && name.trim() !== '') {
      finalSlug = slugify(name.trim());
    }

    if (name !== undefined) product.name = name;
    if (finalSlug !== undefined) product.slug = finalSlug;
    if (price !== undefined) product.price = parseFloat(price);
    if (regularPrice !== undefined) product.regularPrice = regularPrice ? parseFloat(regularPrice) : null;
    if (category !== undefined) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (subSubcategory !== undefined) product.subSubcategory = subSubcategory;
    if (image !== undefined) product.image = image;
    if (images !== undefined) product.images = Array.isArray(images) ? images : [images];
    if (specs !== undefined) product.specs = Array.isArray(specs) ? specs : (specs ? specs.split(',').map(s => s.trim()) : []);
    if (specifications !== undefined) {
      product.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    }
    if (description !== undefined) product.description = description;
    if (warranty !== undefined) product.warranty = warranty;
    if (featured !== undefined) product.featured = (featured === true || featured === 'true');
    if (brand !== undefined) product.brand = brand;
    if (model !== undefined) product.model = model;
    if (stock !== undefined) product.stock = (stock === true || stock === 'true');

    await product.save();
    const data = product.toJSON ? product.toJSON() : product;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { slug } = await params;
    const product = await findProduct(slug);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Cascade delete any order items associated with this product
    if (OrderItem) {
      try {
        await OrderItem.destroy({ where: { productId: product.id } });
      } catch (cascadeErr) {
        console.warn('⚠️ Could not cascade delete orderItems:', cascadeErr.message);
      }
    }

    await product.destroy();
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
