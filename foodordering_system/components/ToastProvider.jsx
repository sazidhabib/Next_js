'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';

export default function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      style={{ zIndex: 99999 }}
    />
  );
}
