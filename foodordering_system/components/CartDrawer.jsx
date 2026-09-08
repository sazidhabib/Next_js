'use client';

import React from 'react';
import CheckoutWizardModal from './CheckoutWizardModal';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  restaurant,
  serviceType,
  setServiceType,
}) {
  if (!isOpen) return null;

  return (
    <CheckoutWizardModal
      isOpen={isOpen}
      onClose={onClose}
      cartItems={cartItems}
      onUpdateQuantity={onUpdateQuantity}
      onRemoveItem={onRemoveItem}
      onClearCart={onClearCart}
      restaurant={restaurant}
      serviceType={serviceType}
      setServiceType={setServiceType}
    />
  );
}
