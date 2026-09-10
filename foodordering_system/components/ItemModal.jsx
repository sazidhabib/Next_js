'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';

export default function ItemModal({ item, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');

  // Reset fields when modal opens or item changes
  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setSpecialNotes('');
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const unitPrice = item.basePrice || 0;
  const totalPrice = unitPrice * quantity;

  // Submit handler
  const handleAddToCartSubmit = () => {
    onAddToCart({
      id: item.id,
      name: item.name,
      categoryName: item.categoryName || item.category?.name || item.category || '',
      categoryId: item.categoryId || item.category?.id || '',
      basePrice: item.basePrice,
      imageUrl: item.imageUrl,
      quantity,
      unitPrice,
      itemTotal: unitPrice,
      selectedOptions: [],
      specialNotes: specialNotes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header & Hero Image */}
        <div className="relative h-48 sm:h-56 bg-slate-900 shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and price in hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{item.name}</h2>
            <p className="text-orange-300 font-bold text-lg mt-0.5">
              £{unitPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Description */}
          {item.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-b border-slate-100 pb-4">
              {item.description}
            </p>
          )}

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">
              Special Kitchen Instructions
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Extra crispy crust, dressing on the side, no onions..."
              rows={3}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Modal Footer: Quantity & Add to Cart */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            onClick={handleAddToCartSubmit}
            className="flex-1 flex items-center justify-between bg-orange-600 hover:bg-orange-700 active:scale-98 text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-orange-600/30 transition-all cursor-pointer"
          >
            <span>Add to Order</span>
            <span>£{totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
