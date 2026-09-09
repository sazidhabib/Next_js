'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  User,
  Mail,
  Phone,
  Truck,
  Clock,
  CreditCard,
  Banknote,
  Edit2,
  Check,
  X,
  MapPin,
  Calendar,
  AlertCircle,
  ChevronRight,
  ShoppingCart,
  Search,
  Lock,
} from 'lucide-react';
import * as turf from '@turf/turf';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeModalCardForm from './StripeModalCardForm';
import { playSuccessSound } from './AudioAlert';

export default function CheckoutWizardModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  restaurant,
  serviceType: initialServiceType = 'DELIVERY',
}) {
  const router = useRouter();

  // Active accordion section: 'contact' | 'method' | 'time' | 'payment' | null
  const [activeSection, setActiveSection] = useState('contact');

  // 1. Contact State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isContactSaved, setIsContactSaved] = useState(false);

  // 2. Ordering Method State
  const [serviceType, setServiceType] = useState(initialServiceType || 'DELIVERY'); // 'DELIVERY' | 'PICKUP'
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressPostcode, setAddressPostcode] = useState('');
  const [deliveryCoords, setDeliveryCoords] = useState(null); // { lat, lng }
  const [selectedZone, setSelectedZone] = useState(null);
  const [isInsideZone, setIsInsideZone] = useState(true);
  const [isMethodSaved, setIsMethodSaved] = useState(false);

  // Delivery Fee Modal Alert State
  const [feeModalInfo, setFeeModalInfo] = useState(null); // { fee, total, show: boolean }

  // 3. Available Time Choice State
  const [timeChoiceType, setTimeChoiceType] = useState('ASAP'); // 'ASAP' | 'LATER'
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('06:30 PM - 07:00 PM');
  const [isTimeSaved, setIsTimeSaved] = useState(false);

  // 4. Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('ONLINE'); // 'ONLINE' | 'CASH' | 'CARD'
  const [isPaymentSaved, setIsPaymentSaved] = useState(false);

  // 5. Comments
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState('');

  // 6. Coupon code
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // 7. In-Modal Stripe Payment State
  const [stripeModalData, setStripeModalData] = useState(null); // { clientSecret, publishableKey, orderId, orderNumber, amount, currency }
  const [stripePromise, setStripePromise] = useState(null);

  // General & Leaflet Map References
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const zoneLayersRef = useRef([]);

  // Default Restaurant Coordinates
  const restLat = restaurant?.latitude || 51.5133;
  const restLng = restaurant?.longitude || -0.1362;

  // Initialize restaurant defaults
  useEffect(() => {
    if (restaurant) {
      if (restaurant.address && !deliveryAddress) {
        setAddressCity(restaurant.city || '');
      }
    }
  }, [restaurant]);

  // Handle Delivery Zone Calculation with Turf.js
  const evaluateLocationZone = (lat, lng) => {
    if (!lat || !lng) return;

    const pt = turf.point([lng, lat]);
    const zones = restaurant?.deliveryZones?.filter((z) => !z.isHidden && z.isActive !== false) || [];

    let matchedZone = null;

    for (const zone of zones) {
      // 1. Polygon Zone Check
      if (zone.zoneType === 'SHAPE' && zone.polygon && zone.polygon.length >= 3) {
        try {
          const polyCoords = zone.polygon.map((p) => [p[1], p[0]]);
          if (
            polyCoords[0][0] !== polyCoords[polyCoords.length - 1][0] ||
            polyCoords[0][1] !== polyCoords[polyCoords.length - 1][1]
          ) {
            polyCoords.push(polyCoords[0]);
          }
          const poly = turf.polygon([polyCoords]);
          if (turf.booleanPointInPolygon(pt, poly)) {
            matchedZone = zone;
            break;
          }
        } catch (err) {
          console.warn('Polygon evaluation error:', err);
        }
      }
      // 2. Radius / Circle Zone Check
      else if (zone.radiusKm) {
        const center = turf.point([restLng, restLat]);
        const distKm = turf.distance(center, pt, { units: 'kilometers' });
        if (distKm <= zone.radiusKm) {
          matchedZone = zone;
          break;
        }
      }
    }

    if (matchedZone) {
      setSelectedZone(matchedZone);
      setIsInsideZone(true);
      return { zone: matchedZone, isInside: true, fee: matchedZone.deliveryFee || 2.5 };
    } else {
      const outsideFee = 5.0;
      setSelectedZone(null);
      setIsInsideZone(false);
      return { zone: null, isInside: false, fee: outsideFee };
    }
  };

  // Map Initialization when Ordering Method is active and Delivery is selected
  useEffect(() => {
    if (!isOpen || activeSection !== 'method' || serviceType !== 'DELIVERY') return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;

      // Monkey-patch DomUtil.getPosition to safely handle undefined/null elements.
      // Prevents "Cannot read properties of undefined (reading '_leaflet_pos')" in modals/iframes.
      const _origGetPosition = L.DomUtil.getPosition;
      L.DomUtil.getPosition = function (el) {
        if (!el) return new L.Point(0, 0);
        return _origGetPosition.call(this, el);
      };

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch (_e) { /* ignore */ }
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [deliveryCoords?.lat || restLat, deliveryCoords?.lng || restLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
        zoomAnimation: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Render Delivery Zones
      const zones = restaurant?.deliveryZones?.filter((z) => !z.isHidden && z.isActive !== false) || [];
      const zoneLayers = [];

      zones.forEach((zone) => {
        const color = zone.color || '#ea580c';
        if (zone.zoneType === 'SHAPE' && zone.polygon && zone.polygon.length >= 3) {
          const polyLayer = L.polygon(zone.polygon, {
            color: color,
            weight: 2,
            fillColor: color,
            fillOpacity: 0.2,
          }).addTo(map);
          zoneLayers.push(polyLayer);
        } else if (zone.radiusKm) {
          const circleLayer = L.circle([restLat, restLng], {
            radius: zone.radiusKm * 1000,
            color: color,
            weight: 2,
            fillColor: color,
            fillOpacity: 0.15,
          }).addTo(map);
          zoneLayers.push(circleLayer);
        }
      });

      zoneLayersRef.current = zoneLayers;

      // Custom Delivery Pin Icon
      const pinIcon = L.divIcon({
        className: 'custom-customer-pin',
        html: `
          <div style="transform: translate(-50%, -100%); cursor: pointer;">
            <div style="background: #ea580c; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid #ffffff;">
              <svg style="transform: rotate(45deg); width: 18px; height: 18px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        `,
        iconSize: [0, 0],
      });

      const initialPt = [deliveryCoords?.lat || restLat, deliveryCoords?.lng || restLng];
      const marker = L.marker(initialPt, {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        setDeliveryCoords({ lat, lng });
        evaluateLocationZone(lat, lng);
      });

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setDeliveryCoords({ lat, lng });
        evaluateLocationZone(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    setTimeout(initMap, 150);

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, activeSection, serviceType]);

  // Geocode address lookup
  const handleLookupAddress = async () => {
    const fullQuery = `${deliveryAddress} ${addressCity} ${addressPostcode}`.trim();
    if (!fullQuery) return;

    try {
      const cleanPostcode = (addressPostcode || deliveryAddress).trim().replace(/\s+/g, '');
      if (/^[A-Z]{1,2}[0-9][A-Z0-9]?[0-9][A-Z]{2}$/i.test(cleanPostcode)) {
        const res = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
        const data = await res.json();
        if (data.status === 200 && data.result) {
          const lat = data.result.latitude;
          const lng = data.result.longitude;
          setDeliveryCoords({ lat, lng });
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 15);
            markerRef.current.setLatLng([lat, lng]);
          }
          evaluateLocationZone(lat, lng);
          return;
        }
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullQuery
        )}&limit=1`
      );
      const list = await res.json();
      if (list && list.length > 0) {
        const lat = parseFloat(list[0].lat);
        const lng = parseFloat(list[0].lon);
        setDeliveryCoords({ lat, lng });
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          markerRef.current.setLatLng([lat, lng]);
        }
        evaluateLocationZone(lat, lng);
      }
    } catch (err) {
      console.warn('Address geocoding error:', err);
    }
  };

  // Pricing Calculations with 20% VAT Breakdown
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  let deliveryFee = 0;
  if (serviceType === 'DELIVERY') {
    if (selectedZone) {
      if (
        selectedZone.freeDeliveryThreshold &&
        subtotal >= selectedZone.freeDeliveryThreshold
      ) {
        deliveryFee = 0;
      } else {
        deliveryFee = selectedZone.deliveryFee || 2.5;
      }
    } else {
      deliveryFee = 5.0;
    }
  }

  const vatRate = 0.2; // 20% UK VAT
  const vatSubtotalIncluded = (subtotal * vatRate) / (1 + vatRate);
  const deliveryFeeTaxIncluded = (deliveryFee * vatRate) / (1 + vatRate);
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  const minDeliveryOrder = selectedZone?.minOrderAmount || 15.0;
  const isBelowMin = serviceType === 'DELIVERY' && subtotal < minDeliveryOrder;

  // Strict Validation Flag: is the form completely fulfilled?
  const isFormFullyFulfilled =
    isContactSaved &&
    isMethodSaved &&
    isTimeSaved &&
    isPaymentSaved &&
    cartItems.length > 0 &&
    !isBelowMin;

  // Handlers for Saving Sections
  const handleSaveContact = (e) => {
    e?.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      toast.warning('Please complete all required contact fields (*)');
      return;
    }
    setIsContactSaved(true);
    setActiveSection('method');
  };

  const handleSaveOrderingMethod = (e) => {
    e?.preventDefault();
    if (serviceType === 'DELIVERY' && !deliveryAddress.trim()) {
      toast.warning('Please provide your delivery street address');
      return;
    }

    setIsMethodSaved(true);
    setActiveSection('time');

    // Show the Delivery Fee Popup alert modal
    if (serviceType === 'DELIVERY') {
      setFeeModalInfo({
        fee: deliveryFee,
        total: totalAmount,
      });
    }
  };

  const handleSaveTime = (e) => {
    e?.preventDefault();
    setIsTimeSaved(true);
    setActiveSection('payment');
  };

  const handleSavePayment = (e) => {
    e?.preventDefault();
    setIsPaymentSaved(true);
    setActiveSection(null);
  };

  // Safe Navigation Click Handlers with Precondition Locks
  const handleOpenMethodSection = () => {
    if (!isContactSaved) {
      toast.warning('Please fill in and save your Contact info first.');
      setActiveSection('contact');
      return;
    }
    setActiveSection('method');
  };

  const handleOpenTimeSection = () => {
    if (!isContactSaved) {
      toast.warning('Please fill in and save your Contact info first.');
      setActiveSection('contact');
      return;
    }
    if (!isMethodSaved) {
      toast.warning('Please select and save your Ordering Method first.');
      setActiveSection('method');
      return;
    }
    setActiveSection('time');
  };

  const handleOpenPaymentSection = () => {
    if (!isContactSaved) {
      toast.warning('Please fill in and save your Contact info first.');
      setActiveSection('contact');
      return;
    }
    if (!isMethodSaved) {
      toast.warning('Please select and save your Ordering Method first.');
      setActiveSection('method');
      return;
    }
    if (!isTimeSaved) {
      toast.warning('Please select and save your Available Time Choice first.');
      setActiveSection('time');
      return;
    }
    setActiveSection('payment');
  };

  // Submit Full Order
  const handlePlaceOrder = async () => {
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty');
      toast.warning('Your cart is empty');
      return;
    }

    if (!isContactSaved) {
      setActiveSection('contact');
      setErrorMessage('Please save your contact details first');
      toast.warning('Please save your contact details');
      return;
    }

    if (!isMethodSaved) {
      setActiveSection('method');
      setErrorMessage('Please save your ordering method first');
      toast.warning('Please save your ordering method');
      return;
    }

    if (!isTimeSaved) {
      setActiveSection('time');
      setErrorMessage('Please save your available time choice');
      toast.warning('Please save your available time choice');
      return;
    }

    if (!isPaymentSaved) {
      setActiveSection('payment');
      setErrorMessage('Please save your payment method');
      toast.warning('Please save your payment method');
      return;
    }

    if (isBelowMin) {
      const needed = (minDeliveryOrder - subtotal).toFixed(2);
      setErrorMessage(`Minimum order for delivery is £${minDeliveryOrder.toFixed(2)}. Add £${needed} more.`);
      toast.warning(`Minimum order is £${minDeliveryOrder.toFixed(2)}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const fullCustomerName = `${firstName} ${lastName}`.trim();
      const formattedAddress =
        serviceType === 'DELIVERY'
          ? [deliveryAddress, addressCity, addressPostcode].filter(Boolean).join(', ')
          : null;

      const payload = {
        restaurantId: restaurant?.id,
        customerName: fullCustomerName,
        customerPhone: phone,
        customerEmail: email,
        orderType: serviceType,
        deliveryAddress: formattedAddress,
        deliveryZoneName: selectedZone?.name || (isInsideZone ? 'Standard Delivery' : 'Outside Zone'),
        specialNotes: comments,
        subtotal,
        taxAmount: vatSubtotalIncluded + deliveryFeeTaxIncluded,
        deliveryFee,
        discountAmount,
        totalAmount,
        paymentMethod:
          paymentMethod === 'ONLINE'
            ? 'CARD_ONLINE'
            : paymentMethod === 'CASH'
            ? serviceType === 'DELIVERY'
              ? 'CASH_ON_DELIVERY'
              : 'CASH_ON_PICKUP'
            : serviceType === 'DELIVERY'
            ? 'CARD_ON_DELIVERY'
            : 'CARD_ON_PICKUP',
        scheduledFor: timeChoiceType === 'LATER' ? `${selectedDate} ${selectedTimeSlot}` : 'ASAP',
        items: cartItems,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.data) {
        playSuccessSound();
        toast.success('Order placed successfully!');
        onClearCart();

        const orderTargetUrl = `/order/${data.data.id || data.data.orderNumber}`;

        if (paymentMethod === 'ONLINE') {
          try {
            const piRes = await fetch('/api/create-payment-intent', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.data.id }),
            });
            const piData = await piRes.json();
            if (piData.success && piData.clientSecret) {
              const pubKey = piData.publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
              if (pubKey) {
                setStripePromise(loadStripe(pubKey));
              }
              setStripeModalData({
                clientSecret: piData.clientSecret,
                orderId: data.data.id,
                orderNumber: data.data.orderNumber,
                amount: piData.amount || totalAmount,
                currency: piData.currency || 'GBP',
              });
              return;
            } else {
              toast.error(piData.error || 'Online payment initialization failed. Navigating to order summary.');
              if (window.top) {
                window.top.location.href = orderTargetUrl;
              } else {
                window.location.href = orderTargetUrl;
              }
              return;
            }
          } catch (piErr) {
            console.error('PaymentIntent creation error:', piErr);
            toast.error('Network error reaching payment service. Navigating to order summary.');
            if (window.top) {
              window.top.location.href = orderTargetUrl;
            } else {
              window.location.href = orderTargetUrl;
            }
            return;
          }
        } else {
          // Immediately navigate to the Waiting for Kitchen Confirmation page
          if (window.top) {
            window.top.location.href = orderTargetUrl;
          } else {
            window.location.href = orderTargetUrl;
          }
          return;
        }
      } else {
        const err = data.error || 'Failed to place order.';
        setErrorMessage(err);
        toast.error(err);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('Network error during checkout. Please try again.');
      toast.error('Network error during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Submitting Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-white">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-center space-y-1">
            <p className="font-extrabold text-base">Placing Your Order...</p>
            <p className="text-xs text-slate-400">Connecting directly to restaurant kitchen</p>
          </div>
        </div>
      )}

      {/* In-Modal Stripe Payment Elements Step */}
      {stripeModalData && stripePromise && (
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[95vh] z-70 animate-scaleUp">
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wide">
                Secure Card Checkout
              </h2>
            </div>
            <button
              onClick={() => {
                const target = `/order/${stripeModalData.orderId}`;
                if (window.top) window.top.location.href = target;
                else window.location.href = target;
              }}
              className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto">
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: stripeModalData.clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#ea580c',
                    colorBackground: '#ffffff',
                    colorText: '#1e293b',
                    borderRadius: '12px',
                  },
                },
              }}
            >
              <StripeModalCardForm
                orderId={stripeModalData.orderId}
                orderNumber={stripeModalData.orderNumber}
                amount={stripeModalData.amount}
                currency={stripeModalData.currency}
                onPaymentSuccess={(_pi) => {
                  const target = `/order/${stripeModalData.orderId}`;
                  if (window.top) window.top.location.href = target;
                  else window.location.href = target;
                }}
                onCancel={() => {
                  setStripeModalData(null);
                  setActiveSection('payment');
                }}
              />
            </Elements>
          </div>
        </div>
      )}

      {/* Main Container */}
      {!stripeModalData && (
      <div className="relative w-full max-w-4xl bg-[#fdfdfd] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Top Mini Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            <h1 className="text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide">
              {restaurant?.name || 'Checkout'}
            </h1>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Checkout Content (2-Columns Layout) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#f8f9fa]">
          {/* =========================================================
              LEFT COLUMN: 4 Accordion Steps + Comments
             ========================================================= */}
          <div className="lg:col-span-7 space-y-3">
            {/* 1. CONTACT SECTION */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Contact
                  </span>
                </div>

                {isContactSaved && activeSection !== 'contact' && (
                  <button
                    onClick={() => setActiveSection('contact')}
                    className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-white shadow-2xs transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeSection === 'contact' && isContactSaved && (
                  <button
                    onClick={() => setActiveSection(null)}
                    className="text-xs font-semibold px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-md transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Active Form */}
              {activeSection === 'contact' ? (
                <form onSubmit={handleSaveContact} className="p-4 sm:p-5 space-y-3.5 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name *"
                        required
                        className="w-full pl-8 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name *"
                        required
                        className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail *"
                      required
                      className="w-full pl-8 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telephone *"
                      required
                      className="w-full pl-8 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>

                  {/* Marketing Checkbox */}
                  <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span>
                      Yes, I would like to receive marketing communications from this Restaurant.
                      You can unsubscribe at any time. Please review the Restaurant's Privacy Policy.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-all cursor-pointer mt-2"
                  >
                    Save
                  </button>
                </form>
              ) : isContactSaved ? (
                /* Collapsed Contact Summary */
                <div className="p-4 text-xs text-slate-700 space-y-0.5 bg-white">
                  <p className="font-semibold text-slate-900">
                    {firstName} {lastName}
                  </p>
                  <p className="text-slate-600">{email}</p>
                  <p className="text-slate-600">{phone}</p>
                </div>
              ) : (
                /* Not filled yet */
                <div className="p-4 bg-white">
                  <button
                    type="button"
                    onClick={() => setActiveSection('contact')}
                    className="w-full py-2.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add details</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. ORDERING METHOD SECTION */}
            <div className={`bg-white border rounded-xl shadow-xs overflow-hidden transition-all ${
              !isContactSaved ? 'border-slate-200 opacity-80' : 'border-slate-200'
            }`}>
              <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Ordering Method
                  </span>
                  {!isContactSaved && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Fill contact first
                    </span>
                  )}
                </div>

                {isMethodSaved && activeSection !== 'method' && (
                  <button
                    onClick={handleOpenMethodSection}
                    className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-white shadow-2xs transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeSection === 'method' && isMethodSaved && (
                  <button
                    onClick={() => setActiveSection(null)}
                    className="text-xs font-semibold px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-md transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Active Ordering Method Form */}
              {activeSection === 'method' ? (
                <form onSubmit={handleSaveOrderingMethod} className="p-4 sm:p-5 space-y-4 bg-white">
                  {/* Delivery vs Pickup Tick Mark Options */}
                  <div className="space-y-2">
                    <label
                      onClick={() => setServiceType('DELIVERY')}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        serviceType === 'DELIVERY'
                          ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            serviceType === 'DELIVERY'
                              ? 'bg-orange-600 border-orange-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {serviceType === 'DELIVERY' && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>Delivery</span>
                      </div>
                      <span className="text-[11px] text-slate-500">To your address</span>
                    </label>

                    <label
                      onClick={() => setServiceType('PICKUP')}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        serviceType === 'PICKUP'
                          ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            serviceType === 'PICKUP'
                              ? 'bg-orange-600 border-orange-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {serviceType === 'PICKUP' && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>Pickup (Collection)</span>
                      </div>
                      <span className="text-[11px] text-slate-500">From restaurant</span>
                    </label>
                  </div>

                  {/* Delivery Address & Map Verification */}
                  {serviceType === 'DELIVERY' && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700">
                          Street Address & Building / Flat No. *
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          onBlur={handleLookupAddress}
                          placeholder="e.g. 37 Astwood Road, Flat 2"
                          required
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Town / City</label>
                          <input
                            type="text"
                            value={addressCity}
                            onChange={(e) => setAddressCity(e.target.value)}
                            onBlur={handleLookupAddress}
                            placeholder="Worcester"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Postcode</label>
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={addressPostcode}
                              onChange={(e) => setAddressPostcode(e.target.value)}
                              onBlur={handleLookupAddress}
                              placeholder="WR3 8ER"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={handleLookupAddress}
                              className="px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
                              title="Locate Postcode"
                            >
                              <Search className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Leaflet Delivery Map */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-orange-600" />
                            <span>Confirm Location Pin on Map</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Drag pin to adjust delivery point
                          </span>
                        </div>

                        <div className="relative w-full h-44 rounded-xl border border-slate-300 overflow-hidden shadow-2xs">
                          <div ref={mapContainerRef} className="w-full h-full z-10" />
                        </div>

                        {/* Zone Status Notice */}
                        <div
                          className={`p-2.5 rounded-lg text-xs flex items-center justify-between font-medium ${
                            isInsideZone
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                              : 'bg-amber-50 border border-amber-200 text-amber-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {isInsideZone
                                ? `Inside Delivery Zone: ${selectedZone?.name || 'Standard Area'}`
                                : 'Outside standard delivery zones (surcharge applies)'}
                            </span>
                          </div>
                          <span className="font-bold">
                            Fee: £{deliveryFee.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-all cursor-pointer mt-2"
                  >
                    Save
                  </button>
                </form>
              ) : isMethodSaved ? (
                /* Collapsed Ordering Method Summary */
                <div className="p-4 text-xs text-slate-700 space-y-0.5 bg-white">
                  {serviceType === 'DELIVERY' ? (
                    <>
                      <p className="font-semibold text-slate-900">Delivery to:</p>
                      <p className="text-slate-600">
                        {[deliveryAddress, addressCity, addressPostcode].filter(Boolean).join(', ')}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900">Pickup (Collection):</p>
                      <p className="text-slate-600">{restaurant?.address || 'At restaurant location'}</p>
                    </>
                  )}
                </div>
              ) : (
                /* Not filled yet */
                <div className="p-4 bg-white">
                  <button
                    type="button"
                    onClick={handleOpenMethodSection}
                    className="w-full py-2.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Select order type</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. AVAILABLE TIME CHOICE SECTION */}
            <div className={`bg-white border rounded-xl shadow-xs overflow-hidden transition-all ${
              !isMethodSaved ? 'border-slate-200 opacity-80' : 'border-slate-200'
            }`}>
              <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Available Time Choice
                  </span>
                  {!isMethodSaved && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Fill method first
                    </span>
                  )}
                </div>

                {isTimeSaved && activeSection !== 'time' && (
                  <button
                    onClick={handleOpenTimeSection}
                    className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-white shadow-2xs transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeSection === 'time' && isTimeSaved && (
                  <button
                    onClick={() => setActiveSection(null)}
                    className="text-xs font-semibold px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-md transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Active Time Choice Form */}
              {activeSection === 'time' ? (
                <form onSubmit={handleSaveTime} className="p-4 sm:p-5 space-y-3.5 bg-white">
                  {/* Checkbox-style choices */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
                    <label
                      onClick={() => setTimeChoiceType('ASAP')}
                      className={`flex items-center gap-2.5 p-3 text-xs font-semibold cursor-pointer transition-colors ${
                        timeChoiceType === 'ASAP' ? 'bg-[#e2edf8] text-slate-900' : 'bg-white text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                          timeChoiceType === 'ASAP'
                            ? 'bg-slate-800 border-slate-800 text-white'
                            : 'border-slate-400 bg-white'
                        }`}
                      >
                        {timeChoiceType === 'ASAP' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>As soon as possible</span>
                    </label>

                    <label
                      onClick={() => setTimeChoiceType('LATER')}
                      className={`flex items-center gap-2.5 p-3 text-xs font-semibold cursor-pointer transition-colors ${
                        timeChoiceType === 'LATER' ? 'bg-[#e2edf8] text-slate-900' : 'bg-white text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                          timeChoiceType === 'LATER'
                            ? 'bg-slate-800 border-slate-800 text-white'
                            : 'border-slate-400 bg-white'
                        }`}
                      >
                        {timeChoiceType === 'LATER' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>Later</span>
                    </label>
                  </div>

                  {/* Date & Time Selectors when Later is selected */}
                  {timeChoiceType === 'LATER' && (
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Date</label>
                        <div className="relative">
                          <select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-slate-300 rounded-lg appearance-none text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="Today">Today</option>
                            <option value="Tomorrow">Tomorrow</option>
                            <option value="In 2 days">In 2 days</option>
                          </select>
                          <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-3 rotate-90 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Time</label>
                        <div className="relative">
                          <select
                            value={selectedTimeSlot}
                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                            className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-slate-300 rounded-lg appearance-none text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="05:30 PM - 06:00 PM">05:30 PM - 06:00 PM</option>
                            <option value="06:00 PM - 06:30 PM">06:00 PM - 06:30 PM</option>
                            <option value="06:30 PM - 07:00 PM">06:30 PM - 07:00 PM</option>
                            <option value="07:00 PM - 07:30 PM">07:00 PM - 07:30 PM</option>
                            <option value="07:30 PM - 08:00 PM">07:30 PM - 08:00 PM</option>
                            <option value="08:00 PM - 08:30 PM">08:00 PM - 08:30 PM</option>
                            <option value="08:30 PM - 09:00 PM">08:30 PM - 09:00 PM</option>
                          </select>
                          <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-3 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-all cursor-pointer mt-2"
                  >
                    Save
                  </button>
                </form>
              ) : isTimeSaved ? (
                /* Collapsed Summary */
                <div className="p-4 text-xs text-slate-700 bg-white">
                  <p className="text-slate-700">
                    {timeChoiceType === 'ASAP'
                      ? 'As soon as possible'
                      : `${selectedDate} at ${selectedTimeSlot}`}
                  </p>
                </div>
              ) : (
                /* Not filled yet */
                <div className="p-4 bg-white">
                  <button
                    type="button"
                    onClick={handleOpenTimeSection}
                    className="w-full py-2.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Choose order time</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. PAYMENT METHOD SECTION */}
            <div className={`bg-white border rounded-xl shadow-xs overflow-hidden transition-all ${
              !isTimeSaved ? 'border-slate-200 opacity-80' : 'border-slate-200'
            }`}>
              <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Payment Method
                  </span>
                  {!isTimeSaved && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Fill time first
                    </span>
                  )}
                </div>

                {isPaymentSaved && activeSection !== 'payment' && (
                  <button
                    onClick={handleOpenPaymentSection}
                    className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-white shadow-2xs transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeSection === 'payment' && isPaymentSaved && (
                  <button
                    onClick={() => setActiveSection(null)}
                    className="text-xs font-semibold px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded-md transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Active Payment Form */}
              {activeSection === 'payment' ? (
                <form onSubmit={handleSavePayment} className="p-4 sm:p-5 space-y-2.5 bg-white">
                  {/* Pay Online */}
                  <label
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      paymentMethod === 'ONLINE'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'ONLINE'
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {paymentMethod === 'ONLINE' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span>Pay online (Stripe / Apple Pay)</span>
                    </div>
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                  </label>

                  {/* Cash */}
                  <label
                    onClick={() => setPaymentMethod('CASH')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      paymentMethod === 'CASH'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'CASH'
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {paymentMethod === 'CASH' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span>Cash on {serviceType === 'DELIVERY' ? 'delivery' : 'collection'}</span>
                    </div>
                    <Banknote className="w-4 h-4 text-emerald-600" />
                  </label>

                  {/* Card at door */}
                  <label
                    onClick={() => setPaymentMethod('CARD')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'CARD'
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {paymentMethod === 'CARD' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span>Card on {serviceType === 'DELIVERY' ? 'delivery' : 'collection'}</span>
                    </div>
                    <CreditCard className="w-4 h-4 text-orange-500" />
                  </label>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-all cursor-pointer mt-2"
                  >
                    Save
                  </button>
                </form>
              ) : isPaymentSaved ? (
                /* Collapsed Summary */
                <div className="p-4 text-xs text-slate-700 bg-white">
                  <p className="text-slate-700">
                    {paymentMethod === 'ONLINE'
                      ? 'Pay online'
                      : paymentMethod === 'CASH'
                      ? `Cash on ${serviceType === 'DELIVERY' ? 'delivery' : 'collection'}`
                      : `Card on ${serviceType === 'DELIVERY' ? 'delivery' : 'collection'}`}
                  </p>
                </div>
              ) : (
                /* Not filled yet */
                <div className="p-4 bg-white">
                  <button
                    type="button"
                    onClick={handleOpenPaymentSection}
                    className="w-full py-2.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Select payment method</span>
                  </button>
                </div>
              )}
            </div>

            {/* Optional Comments Link */}
            <div className="pt-2">
              {!showComments ? (
                <button
                  type="button"
                  onClick={() => setShowComments(true)}
                  className="text-xs text-slate-600 hover:text-slate-900 underline underline-offset-2 font-medium cursor-pointer"
                >
                  Comments<span className="text-slate-400 no-underline">(Optional)</span>
                </button>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">
                      Comments (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowComments(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      Hide
                    </button>
                  </div>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="e.g. Ring the bell twice, leave on the porch, extra napkins..."
                    rows={2}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 text-slate-800 resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: Order Item Summary & Pricing Breakdown
             ========================================================= */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              {/* Header Table Columns */}
              <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex justify-between text-xs font-bold text-slate-500">
                <div className="flex gap-4">
                  <span className="w-6">Qty</span>
                  <span>Item</span>
                </div>
                <span>Price</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {cartItems.map((it, idx) => (
                  <div key={`${it.id}-${idx}`} className="px-4 py-3 flex items-start justify-between text-xs gap-2">
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-slate-900 w-5">{it.quantity}x</span>
                      <div>
                        <p className="font-bold text-slate-800">{it.name}</p>
                        {it.specialNotes && (
                          <p className="text-[10px] text-slate-500 italic mt-0.5">
                            Note: {it.specialNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-slate-900">
                        {(it.unitPrice * it.quantity).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Minimum Order Warning Bar */}
              {serviceType === 'DELIVERY' && (
                <div className="px-4 py-2 bg-slate-100 text-center text-[11px] font-semibold text-slate-700 border-t border-b border-slate-200">
                  Minimum Order (Delivery) £{minDeliveryOrder.toFixed(2)}
                </div>
              )}

              {/* Financial Calculation Breakdown (20% VAT Breakdown) */}
              <div className="p-4 space-y-2 text-xs border-t border-slate-100">
                {/* Coupon Code Toggle */}
                <div>
                  {!showCoupon ? (
                    <button
                      type="button"
                      onClick={() => setShowCoupon(true)}
                      className="text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium"
                    >
                      Add coupon code
                    </button>
                  ) : (
                    <div className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (couponCode.toUpperCase() === 'DISCOUNT10') {
                            setDiscountAmount(subtotal * 0.1);
                            toast.success('10% Discount applied!');
                          } else {
                            toast.error('Invalid coupon code');
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-bold"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2 space-y-1 text-slate-600 border-t border-slate-100">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span>Sub-Total</span>
                    <span className="font-semibold text-slate-800">£{subtotal.toFixed(2)}</span>
                  </div>

                  {/* VAT 20% Included */}
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>VAT (20% included)</span>
                    <span>£{vatSubtotalIncluded.toFixed(2)}</span>
                  </div>

                  {/* Delivery Fee */}
                  {serviceType === 'DELIVERY' && (
                    <>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-semibold text-slate-800">
                          {deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}
                        </span>
                      </div>
                      {deliveryFee > 0 && (
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>Delivery Fee Tax (20% included)</span>
                          <span>£{deliveryFeeTaxIncluded.toFixed(2)}</span>
                        </div>
                      )}
                    </>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Coupon Discount</span>
                      <span>-£{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span className="text-base font-extrabold text-slate-900">
                      £{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            BOTTOM BAR: Legal Text & Large Orange Submission Button
           ========================================================= */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-lg">
          <div className="text-[10px] text-slate-500 leading-tight space-y-0.5 max-w-md text-center sm:text-left">
            <p className="font-medium text-slate-600">By placing this order you accept the:</p>
            <p>- Online Ordering Privacy Policy & Agreement</p>
            <p>- Restaurant: Terms - Privacy Policy - Cookie Preferences</p>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={!isFormFullyFulfilled || isSubmitting}
            className={`w-full sm:w-auto min-w-[320px] flex items-center rounded-xl shadow-md overflow-hidden font-bold transition-all ${
              isFormFullyFulfilled && !isSubmitting
                ? 'bg-[#f59e0b] hover:bg-[#d97706] text-white cursor-pointer active:scale-98'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
            }`}
          >
            <div className="px-4 py-3.5 bg-black/10 border-r border-white/20 text-xs sm:text-sm text-left flex flex-col justify-center">
              <span className={`text-[9px] uppercase tracking-wider ${isFormFullyFulfilled ? 'text-amber-100' : 'text-slate-500'}`}>TOTAL</span>
              <span>£{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex-1 px-5 py-3.5 text-center text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5">
              {!isFormFullyFulfilled && <Lock className="w-3.5 h-3.5" />}
              <span>
                {isSubmitting
                  ? 'Processing Order...'
                  : !isContactSaved
                  ? 'Complete Contact info to continue'
                  : !isMethodSaved
                  ? 'Select ordering method to continue'
                  : !isTimeSaved
                  ? 'Choose time to continue'
                  : !isPaymentSaved
                  ? 'Select payment method to continue'
                  : isBelowMin
                  ? `Min Order £${minDeliveryOrder.toFixed(2)}`
                  : serviceType === 'DELIVERY'
                  ? 'Place Delivery Order Now'
                  : 'Place Pickup Order Now'}
              </span>
            </div>
          </button>
        </div>
      </div>
      )}

      {/* =========================================================
          DELIVERY FEE ADJUSTMENT MODAL
         ========================================================= */}
      {feeModalInfo && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-center space-y-4 border border-slate-100 animate-scaleUp">
            <div className="w-16 h-16 rounded-full border-2 border-slate-300 mx-auto flex items-center justify-center text-slate-600">
              <ShoppingCart className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                A delivery fee of £{feeModalInfo.fee.toFixed(2)} was added to your location.
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Your total is £{feeModalInfo.total.toFixed(2)} (all taxes included).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFeeModalInfo(null)}
              className="w-full py-2.5 bg-[#c25e00] hover:bg-[#a34e00] text-white font-bold text-xs sm:text-sm rounded-lg transition-all cursor-pointer shadow-xs"
            >
              OK, back to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
