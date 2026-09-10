'use client';

import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function StripeModalCardForm({
  orderId,
  orderNumber,
  amount,
  currency = 'GBP',
  onPaymentSuccess,
  onCancel,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currencySymbol = currency.toUpperCase() === 'USD' ? '$' : currency.toUpperCase() === 'EUR' ? '€' : '£';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (result.error) {
        setErrorMessage(result.error.message || 'Payment failed. Please check your card info.');
        toast.error(result.error.message || 'Payment failed');
        setIsProcessing(false);
      } else if (result.paymentIntent && (result.paymentIntent.status === 'succeeded' || result.paymentIntent.status === 'processing')) {
        // Payment succeeded directly in modal!
        // Notify backend to mark order as PAID and trigger kitchen thermal print
        try {
          const putRes = await fetch('/api/create-payment-intent', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              paymentIntentId: result.paymentIntent.id,
            }),
          });
          const putJson = await putRes.json();
          if (!putJson.success) {
            console.warn('Backend payment status update warning:', putJson.error);
          }
        } catch (_putErr) {
          console.error('Error updating order payment status:', _putErr);
        }

        toast.success('Payment verified successfully!');
        onPaymentSuccess(result.paymentIntent);
      } else {
        // Handle any edge state
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('In-modal stripe confirm error:', err);
      setErrorMessage('Unexpected payment error. Please try again.');
      toast.error('Payment processing failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 text-slate-800 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">Complete Payment</h3>
            <p className="text-[11px] text-slate-500">
              Order #{orderNumber || orderId} • <span className="font-bold text-slate-900">{currencySymbol}{Number(amount).toFixed(2)}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit SSL</span>
        </div>
      </div>

      {/* Stripe Embedded Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
          <PaymentElement
            options={{
              layout: {
                type: 'tabs',
                defaultCollapsed: false,
              },
            }}
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying with Stripe...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Pay {currencySymbol}{Number(amount).toFixed(2)} Now</span>
              </>
            )}
          </button>

          {onCancel && !isProcessing && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel & Change Payment Method
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
