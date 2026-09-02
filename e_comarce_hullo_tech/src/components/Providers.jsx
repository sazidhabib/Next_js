"use client";

import { CartProvider } from "../lib/CartContext";
import { ToastContainer } from "react-toastify";

export function Providers({ children }) {
  return (
    <CartProvider>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </CartProvider>
  );
}
