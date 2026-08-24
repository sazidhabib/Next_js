'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, AlertCircle, Sparkles } from 'lucide-react';

export default function ItemModal({ item, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [specialNotes, setSpecialNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  // Pre-select defaults when modal opens or item changes
  useEffect(() => {
    if (!item) return;

    setQuantity(1);
    setSpecialNotes('');
    setValidationError('');

    const initialSelections = {};
    if (item.optionGroups && item.optionGroups.length > 0) {
      item.optionGroups.forEach((group) => {
        if (group.minSelections === 1 && group.maxSelections === 1) {
          // Single select default
          const defaultItem =
            group.items.find((opt) => opt.isDefault) || group.items[0];
          if (defaultItem) {
            initialSelections[group.id] = [defaultItem];
          }
        } else {
          // Optional multi-select defaults
          const defaultItems = group.items.filter((opt) => opt.isDefault);
          initialSelections[group.id] = defaultItems;
        }
      });
    }
    setSelectedOptions(initialSelections);
  }, [item]);

  if (!isOpen || !item) return null;

  // Option selection handlers
  const handleSingleSelect = (group, optionItem) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [group.id]: [optionItem],
    }));
    setValidationError('');
  };

  const handleMultiSelect = (group, optionItem) => {
    const current = selectedOptions[group.id] || [];
    const exists = current.some((opt) => opt.id === optionItem.id);

    if (exists) {
      // Remove option
      setSelectedOptions((prev) => ({
        ...prev,
        [group.id]: current.filter((opt) => opt.id !== optionItem.id),
      }));
    } else {
      // Check max selections
      if (group.maxSelections && current.length >= group.maxSelections) {
        setValidationError(
          `You can select a maximum of ${group.maxSelections} option(s) for "${group.name}".`
        );
        return;
      }
      setSelectedOptions((prev) => ({
        ...prev,
        [group.id]: [...current, optionItem],
      }));
      setValidationError('');
    }
  };

  // Calculate dynamic item total
  const optionsExtraTotal = Object.values(selectedOptions)
    .flat()
    .reduce((sum, opt) => sum + (opt?.price || 0), 0);

  const unitPrice = item.basePrice + optionsExtraTotal;
  const totalPrice = unitPrice * quantity;

  // Validate and submit
  const handleAddToCartSubmit = () => {
    // Check required option groups
    if (item.optionGroups) {
      for (const group of item.optionGroups) {
        const selections = selectedOptions[group.id] || [];
        if (group.minSelections > 0 && selections.length < group.minSelections) {
          setValidationError(
            `Please make a selection for required option: "${group.name}".`
          );
          return;
        }
      }
    }

    const flatSelectedOptions = Object.entries(selectedOptions).flatMap(
      ([groupId, opts]) => {
        const group = item.optionGroups.find((g) => g.id === groupId);
        return opts.map((opt) => ({
          groupId,
          groupName: group?.name || 'Options',
          optionId: opt.id,
          optionName: opt.name,
          optionPrice: opt.price,
        }));
      }
    );

    onAddToCart({
      id: item.id,
      name: item.name,
      basePrice: item.basePrice,
      imageUrl: item.imageUrl,
      quantity,
      unitPrice,
      itemTotal: unitPrice,
      selectedOptions: flatSelectedOptions,
      specialNotes,
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
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and price in hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              {item.dietaryTags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-orange-500/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{item.name}</h2>
            <p className="text-orange-300 font-bold text-lg mt-0.5">
              ${item.basePrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Scrollable Options Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Description */}
          {item.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-b border-slate-100 pb-4">
              {item.description}
            </p>
          )}

          {/* Validation Warning Alert */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Option Groups */}
          {item.optionGroups && item.optionGroups.length > 0 ? (
            item.optionGroups.map((group) => {
              const isSingleSelect =
                group.minSelections === 1 && group.maxSelections === 1;
              const currentSelections = selectedOptions[group.id] || [];

              return (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{group.name}</span>
                        {group.minSelections > 0 && (
                          <span className="text-[10px] uppercase font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {isSingleSelect
                          ? 'Select 1 option'
                          : `Select up to ${group.maxSelections} option(s)`}
                      </p>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2">
                    {group.items.map((opt) => {
                      const isSelected = currentSelections.some(
                        (s) => s.id === opt.id
                      );

                      return (
                        <div
                          key={opt.id}
                          onClick={() =>
                            isSingleSelect
                              ? handleSingleSelect(group, opt)
                              : handleMultiSelect(group, opt)
                          }
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-50/70 border-orange-400 text-orange-950 font-medium'
                              : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-${
                                isSingleSelect ? 'full' : 'md'
                              } border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-orange-600 border-orange-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs sm:text-sm">{opt.name}</span>
                          </div>

                          {opt.price > 0 && (
                            <span className="text-xs font-semibold text-slate-900">
                              +${opt.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-slate-400 italic">
              No special options available for this dish. Prepared fresh with standard recipe.
            </div>
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
              rows={2}
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
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
