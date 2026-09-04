'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Printer,
  Download,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Eye,
  X,
} from 'lucide-react';

export default function AdminInvoicesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewInvoiceOrder, setViewInvoiceOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch('/api/orders');
        const json = await res.json();
        if (json.success) {
          setOrders(json.data);
        }
      } catch (err) {
        console.error('Error loading invoices:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(q))
    );
  });

  const totalInvoiced = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Invoices & Billing Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable customer invoices, tax breakdowns, and payment status history.
          </p>
        </div>

        {/* Total Invoiced pill */}
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold">Total Invoiced:</span>
          <span className="text-lg font-black text-emerald-400">
            ${totalInvoiced.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by order #, invoice #, customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Subtotal</th>
                <th className="p-3.5">Tax (8.5%)</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((order, idx) => {
                const invNum =
                  order.invoiceNumber ||
                  `INV-BV-${new Date().getFullYear()}-${8000 + idx}`;

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3.5 font-mono font-bold text-orange-400">
                      {invNum}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">
                      {order.orderNumber}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-[11px] text-slate-500">{order.customerPhone}</p>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      ${order.subtotal?.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      ${order.taxAmount?.toFixed(2)}
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.paymentMethod === 'CARD_ONLINE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() =>
                          setViewInvoiceOrder({ ...order, invoiceNumber: invNum })
                        }
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {viewInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">TAX INVOICE</h2>
                <p className="text-xs text-orange-600 font-mono font-bold mt-0.5">
                  {viewInvoiceOrder.invoiceNumber}
                </p>
              </div>
              <button
                onClick={() => setViewInvoiceOrder(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Restaurant & Customer metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Issued By
                </span>
                <p className="font-bold text-slate-900">
                  Bella Vista Gourmet Kitchen
                </p>
                <p className="text-slate-500">742 Evergreen Terrace, SF, CA</p>
                <p className="text-slate-500">contact@bellavistapizzeria.com</p>
              </div>

              <div className="space-y-0.5">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Billed To
                </span>
                <p className="font-bold text-slate-900">
                  {viewInvoiceOrder.customerName}
                </p>
                <p className="text-slate-500">{viewInvoiceOrder.customerPhone}</p>
                {viewInvoiceOrder.deliveryAddress && (
                  <p className="text-slate-500 line-clamp-1">
                    {viewInvoiceOrder.deliveryAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewInvoiceOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-slate-800">
                        {it.itemName}
                        {it.selectedOptions && it.selectedOptions.length > 0 && (
                          <div className="text-[10px] text-slate-400">
                            {it.selectedOptions.map((o) => o.optionName).join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 text-center font-bold text-slate-700">
                        {it.quantity}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">
                        ${it.itemTotal?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${viewInvoiceOrder.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8.5% VAT)</span>
                <span>${viewInvoiceOrder.taxAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {viewInvoiceOrder.deliveryFee === 0
                    ? 'FREE'
                    : `$${viewInvoiceOrder.deliveryFee?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="text-orange-600">
                  ${viewInvoiceOrder.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setViewInvoiceOrder(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
