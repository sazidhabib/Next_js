'use client';

import React, { useState } from 'react';
import { ProductItem, SpecSection, generateSlug } from '@/lib/types';
import { X, Check, Package, Plus, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';

interface EditProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<ProductItem>) => Promise<void>;
}

export function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  if (!product) return null;

  const [title, setTitle] = useState(product.title);
  const [slug, setSlug] = useState(product.slug || generateSlug(product.title));
  const [price, setPrice] = useState(String(product.price));
  const [regularPrice, setRegularPrice] = useState(String(product.regularPrice || ''));
  const [category, setCategory] = useState(product.category || 'Components');
  const [subcategory, setSubcategory] = useState(product.subcategory || 'SSD');
  const [subSubcategory, setSubSubcategory] = useState(product.subSubcategory || '');
  const [brand, setBrand] = useState(product.brand || 'Netac');
  const [model, setModel] = useState(product.model || '');
  const [warranty, setWarranty] = useState(product.warranty || '3 years warranty');
  const [mainImage, setMainImage] = useState(product.mainImage || product.images?.[0] || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(product.galleryImages || product.images?.slice(1) || []);
  const [keyFeaturesText, setKeyFeaturesText] = useState(
    product.keyFeaturesText || product.features?.join(', ') || ''
  );
  const [structuredSpecs, setStructuredSpecs] = useState<SpecSection[]>(
    product.structuredSpecs && product.structuredSpecs.length > 0
      ? product.structuredSpecs
      : [
          {
            sectionTitle: 'Key Features',
            fields: [
              { label: 'Capacity', value: '120GB' },
              { label: 'Form Factor', value: '2.5"' },
              { label: 'Interface', value: 'SATA III' },
            ],
          },
        ]
  );
  const [description, setDescription] = useState(product.description || '');
  const [featuredProduct, setFeaturedProduct] = useState(product.featuredProduct || false);
  const [inStock, setInStock] = useState(product.inStock ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto regenerate slug on title change if desired
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  // Structured Specs Handlers
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

  const updateSectionTitle = (sIdx: number, titleVal: string) => {
    const updated = [...structuredSpecs];
    updated[sIdx].sectionTitle = titleVal;
    setStructuredSpecs(updated);
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

  const updateField = (sIdx: number, fIdx: number, key: 'label' | 'value', text: string) => {
    const updated = [...structuredSpecs];
    updated[sIdx].fields[fIdx][key] = text;
    setStructuredSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(product.id, {
      title,
      slug,
      price: Number(price) || product.price,
      regularPrice: regularPrice ? Number(regularPrice) : undefined,
      category,
      subcategory,
      subSubcategory: subSubcategory || undefined,
      brand,
      model,
      warranty,
      mainImage,
      galleryImages,
      images: [mainImage, ...galleryImages].filter(Boolean),
      keyFeaturesText,
      structuredSpecs,
      description,
      featuredProduct,
      inStock,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#070d1e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Edit Product</h2>
              <p className="text-xs text-slate-400">Match exact admin panel fields & specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Row 1: Product Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Product Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Slug (URL friendly)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500 font-mono text-xs"
                required
              />
            </div>
          </div>

          {/* Row 2: Price (৳) & Regular Price (৳) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Price (৳)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Regular Price (৳) (Strikethrough)</label>
              <input
                type="number"
                step="0.01"
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500 text-xs"
                placeholder="Optional regular price"
              />
            </div>
          </div>

          {/* Row 3: Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Subcategory</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                required
              />
            </div>
          </div>

          {/* Row 4: Sub-subcategory & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Sub-subcategory</label>
              <input
                type="text"
                value={subSubcategory}
                onChange={(e) => setSubSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                placeholder="e.g. Netac, Samsung, or Capacity"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                required
              />
            </div>
          </div>

          {/* Row 5: Model & Warranty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Warranty</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                required
              />
            </div>
          </div>

          {/* Main Product Image Section */}
          <div className="p-4 bg-[#070d1e] border border-slate-800/90 rounded-2xl space-y-3">
            <h4 className="font-semibold text-slate-200">Main Product Image</h4>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#060a17] border border-slate-700/80 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                {mainImage ? (
                  <img src={mainImage} alt="Main" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-600" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  placeholder="Image URL or local file path"
                  className="w-full px-3 py-2 bg-[#060a17] border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px]"
                />
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium cursor-pointer">
                    Choose Main Image
                  </span>
                  {mainImage && (
                    <button
                      type="button"
                      onClick={() => setMainImage('')}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Gallery (Additional Images) */}
          <div className="p-4 bg-[#070d1e] border border-slate-800/90 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-200">Product Gallery (Additional Images)</h4>
              <button
                type="button"
                onClick={() => setGalleryImages([...galleryImages, ''])}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Gallery Image(s)
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative group w-20 h-20 rounded-xl bg-[#060a17] border border-slate-700 p-1.5 flex items-center justify-center">
                  {img ? (
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-500">Image {idx + 1}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                    className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features (Comma-separated) */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Key Features (Comma-separated)</label>
            <input
              type="text"
              value={keyFeaturesText}
              onChange={(e) => setKeyFeaturesText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-mono"
              placeholder="MPN: NT01N535S-120G-S3X, Model: N535S, Read Speed: 510MB/s, Write Speed: 440MB/s"
            />
          </div>

          {/* Structured Specifications */}
          <div className="p-4 bg-[#070d1e] border border-slate-800/90 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm">Structured Specifications</h4>
              <button
                type="button"
                onClick={addSection}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add Section
              </button>
            </div>

            <div className="space-y-4">
              {structuredSpecs.map((section, sIdx) => (
                <div key={sIdx} className="bg-[#050914] border border-slate-800 rounded-xl p-4 space-y-3">
                  {/* Section Title Bar */}
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={section.sectionTitle}
                      onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                      placeholder="Section Title (e.g. Key Features, Physical Specification, Warranty)"
                      className="px-3 py-1.5 bg-[#0b1329] border border-slate-700/80 rounded-lg text-white font-semibold text-xs flex-1 max-w-xs focus:outline-none focus:border-blue-500"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addField(sIdx)}
                        className="px-2.5 py-1 bg-blue-950/60 text-blue-300 border border-blue-800/60 hover:bg-blue-900/60 rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Field
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSection(sIdx)}
                        className="px-2.5 py-1 bg-rose-950/40 text-rose-300 border border-rose-900/60 hover:bg-rose-900/40 rounded-lg text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Section Field Rows */}
                  <div className="space-y-2 pt-1">
                    {section.fields.map((field, fIdx) => (
                      <div key={fIdx} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(sIdx, fIdx, 'label', e.target.value)}
                            placeholder="Capacity, Interface, etc."
                            className="w-full px-3 py-1.5 bg-[#0b1329] border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500 font-medium"
                          />
                        </div>
                        <div className="col-span-7">
                          <textarea
                            rows={1}
                            value={field.value}
                            onChange={(e) => updateField(sIdx, fIdx, 'value', e.target.value)}
                            placeholder="Value"
                            className="w-full px-3 py-1.5 bg-[#0b1329] border border-slate-800 rounded-lg text-slate-300 text-xs focus:outline-none focus:border-blue-500 resize-y"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeField(sIdx, fIdx)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
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
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#060a17] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 text-xs resize-y"
              placeholder="Full product description with HTML formatting..."
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={featuredProduct}
                onChange={(e) => setFeaturedProduct(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-[#060a17] text-blue-600 focus:ring-blue-500"
              />
              <span>Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-[#060a17] text-blue-600 focus:ring-blue-500"
              />
              <span>In Stock</span>
            </label>
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
