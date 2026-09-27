'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft, Plus, X, Upload, PackageCheck } from 'lucide-react';
import { SpecSection } from '@/lib/types';

export default function MockAdminNewProduct() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [category, setCategory] = useState('Components');
  const [subcategory, setSubcategory] = useState('SSD');
  const [subSubcategory, setSubSubcategory] = useState('Netac');
  const [brand, setBrand] = useState('Netac');
  const [model, setModel] = useState('');
  const [warranty, setWarranty] = useState('3 years warranty');
  const [mainImageFileName, setMainImageFileName] = useState('');
  const [galleryCount, setGalleryCount] = useState(0);
  const [keyFeatures, setKeyFeatures] = useState('');
  const [structuredSpecs, setStructuredSpecs] = useState<SpecSection[]>([
    {
      sectionTitle: 'Key Features',
      fields: [
        { label: 'Capacity', value: '120GB' },
        { label: 'Form Factor', value: '2.5"' },
      ],
    },
  ]);
  const [description, setDescription] = useState('');
  const [featuredProduct, setFeaturedProduct] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<any>(null);

  // Specifications Handlers
  const addSection = () => {
    setStructuredSpecs([
      ...structuredSpecs,
      {
        sectionTitle: 'New Section',
        fields: [{ label: '', value: '' }],
      },
    ]);
  };

  const removeSection = (sIdx: number) => {
    setStructuredSpecs(structuredSpecs.filter((_, idx) => idx !== sIdx));
  };

  const addField = (sIdx: number) => {
    const updated = [...structuredSpecs];
    updated[sIdx].fields.push({ label: '', value: '' });
    setStructuredSpecs(updated);
  };

  const removeField = (sIdx: number, fIdx: number) => {
    const updated = [...structuredSpecs];
    updated[sIdx].fields = updated[sIdx].fields.filter((_, idx) => idx !== fIdx);
    setStructuredSpecs(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      slug,
      price,
      regularPrice,
      category,
      subcategory,
      subSubcategory,
      brand,
      model,
      warranty,
      mainImageFileName,
      galleryCount,
      keyFeatures,
      structuredSpecs,
      description,
      featuredProduct,
      inStock,
      createdAt: new Date().toISOString(),
    };

    setLastSubmitted(payload);
    setIsSuccess(true);

    try {
      const existing = JSON.parse(localStorage.getItem('mock_admin_products') || '[]');
      existing.unshift(payload);
      localStorage.setItem('mock_admin_products', JSON.stringify(existing));
    } catch {}

    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-900/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to AutoPost Dashboard
            </Link>
          </div>
          <Link
            href="/mock-admin/products"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            View Admin Catalog ({'>'})
          </Link>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div
            id="product-created-alert"
            className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-emerald-200 animate-in fade-in duration-300"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Product Ingested Successfully!</h4>
              <p className="text-xs text-emerald-300/80 mt-1">
                "{lastSubmitted?.title}" ({lastSubmitted?.model}) was created with {lastSubmitted?.structuredSpecs?.length} structured specification sections.
              </p>
            </div>
          </div>
        )}

        {/* Main Admin Card */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h1 className="text-lg font-bold text-white tracking-tight">Edit Product</h1>
            <span className="text-xs text-slate-500 font-mono">Store Admin Form</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Product Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Product Name</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Netac N535S 120GB 2.5-inch SATAIII SSD"
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Slug (URL friendly)</label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. netac-n535s-120gb-25-inch-sataii"
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500 font-mono text-xs"
                  required
                />
              </div>
            </div>

            {/* Price (৳) & Regular Price (৳) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Price (৳)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3450.00"
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Regular Price (৳) (Strikethrough)</label>
                <input
                  id="regular-price"
                  name="regular_price"
                  type="number"
                  step="0.01"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                  placeholder="3740.00"
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Category</label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                >
                  <option value="Components">Components</option>
                  <option value="Storage">Storage</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Monitors">Monitors</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Subcategory</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                >
                  <option value="SSD">SSD</option>
                  <option value="RAM">RAM</option>
                  <option value="Processor">Processor</option>
                  <option value="Graphics Card">Graphics Card</option>
                </select>
              </div>
            </div>

            {/* Sub-subcategory & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Sub-subcategory</label>
                <select
                  id="sub-subcategory"
                  name="sub_subcategory"
                  value={subSubcategory}
                  onChange={(e) => setSubSubcategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                >
                  <option value="Netac">Netac</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Western Digital">Western Digital</option>
                  <option value="Kingston">Kingston</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Brand</label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Netac"
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                  required
                />
              </div>
            </div>

            {/* Model & Warranty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Model</label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="N535S"
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Warranty</label>
                <input
                  id="warranty"
                  name="warranty"
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="3 years warranty"
                  className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                  required
                />
              </div>
            </div>

            {/* Main Product Image */}
            <div className="p-4 bg-[#070d1e] border border-slate-800/90 rounded-2xl space-y-3">
              <label className="block text-slate-200 font-semibold">Main Product Image</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#060a17] border border-slate-700 p-1 flex items-center justify-center">
                  <PackageCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      id="main-product-image"
                      name="main_product_image"
                      type="file"
                      onChange={(e) => setMainImageFileName(e.target.files?.[0]?.name || '')}
                      className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium cursor-pointer"
                    />
                  </div>
                  {mainImageFileName && (
                    <div className="text-[11px] font-mono text-blue-300">/uploads/{mainImageFileName}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Gallery (Additional Images) */}
            <div className="p-4 bg-[#070d1e] border border-slate-800/90 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-slate-200 font-semibold">Product Gallery (Additional Images)</label>
                <label className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Gallery Image(s)
                  <input
                    id="gallery-images"
                    name="gallery_images"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => setGalleryCount(e.target.files?.length || 0)}
                  />
                </label>
              </div>
              {galleryCount > 0 && (
                <div className="text-[11px] text-emerald-400 font-medium">
                  {galleryCount} additional gallery file(s) attached
                </div>
              )}
            </div>

            {/* Key Features (Comma-separated) */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Key Features (Comma-separated)</label>
              <input
                id="key-features"
                name="key_features"
                type="text"
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                placeholder="MPN: NT01N535S-120G-S3X, Model: N535S, Read Speed: 510MB/s, Write Speed: 440MB/s"
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-xs"
              />
            </div>

            {/* Structured Specifications */}
            <div className="p-4 bg-[#070d1e] border border-slate-800/90 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Structured Specifications</h3>
                <button
                  type="button"
                  id="add-section-btn"
                  onClick={addSection}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Section
                </button>
              </div>

              <div className="space-y-4">
                {structuredSpecs.map((section, sIdx) => (
                  <div key={sIdx} className="section-block bg-[#050914] border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={section.sectionTitle}
                        onChange={(e) => {
                          const updated = [...structuredSpecs];
                          updated[sIdx].sectionTitle = e.target.value;
                          setStructuredSpecs(updated);
                        }}
                        placeholder="Section Title"
                        className="section-title-input px-3 py-1.5 bg-[#0b1329] border border-slate-700 rounded-lg text-white font-semibold text-xs flex-1 max-w-xs focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addField(sIdx)}
                          className="add-field-btn px-2.5 py-1 bg-blue-950/60 text-blue-300 border border-blue-800/60 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Field
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSection(sIdx)}
                          className="px-2.5 py-1 bg-rose-950/40 text-rose-300 border border-rose-900/60 rounded-lg text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {section.fields.map((field, fIdx) => (
                        <div key={fIdx} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-4">
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => {
                                const updated = [...structuredSpecs];
                                updated[sIdx].fields[fIdx].label = e.target.value;
                                setStructuredSpecs(updated);
                              }}
                              placeholder="Label"
                              className="spec-label-input w-full px-3 py-1.5 bg-[#0b1329] border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="col-span-7">
                            <textarea
                              rows={1}
                              value={field.value}
                              onChange={(e) => {
                                const updated = [...structuredSpecs];
                                updated[sIdx].fields[fIdx].value = e.target.value;
                                setStructuredSpecs(updated);
                              }}
                              placeholder="Value"
                              className="spec-value-input w-full px-3 py-1.5 bg-[#0b1329] border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none focus:border-blue-500 resize-y"
                            />
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <button
                              type="button"
                              onClick={() => removeField(sIdx, fIdx)}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Description</label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description with HTML support..."
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 text-xs resize-y"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                <input
                  id="featured-checkbox"
                  name="featured"
                  type="checkbox"
                  checked={featuredProduct}
                  onChange={(e) => setFeaturedProduct(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-[#060a17] text-blue-600 focus:ring-blue-500"
                />
                <span>Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                <input
                  id="in-stock-checkbox"
                  name="in_stock"
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-[#060a17] text-blue-600 focus:ring-blue-500"
                />
                <span>In Stock</span>
              </label>
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
              <button
                id="save-product-btn"
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-blue-600/25 transition-all"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
