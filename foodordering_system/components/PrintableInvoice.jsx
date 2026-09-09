'use client';

import React from 'react';

/**
 * Categorize ordered items into classic Indian/Restaurant courses
 */
function categorizeOrderItem(item) {
  const name = (item?.itemName || '').toLowerCase();
  const category = (item?.categoryName || '').toLowerCase();

  if (
    category.includes('starter') ||
    category.includes('appetizer') ||
    name.includes('puree') ||
    name.includes('tikka') ||
    name.includes('samosa') ||
    name.includes('pakora') ||
    name.includes('soup') ||
    name.includes('wings')
  ) {
    return 'Starter(s)';
  }

  if (
    category.includes('bread') ||
    category.includes('nan') ||
    category.includes('naan') ||
    category.includes('roti') ||
    name.includes('nan') ||
    name.includes('naan') ||
    name.includes('roti') ||
    name.includes('paratha') ||
    name.includes('chapati')
  ) {
    return 'Bread';
  }

  if (
    category.includes('rice') ||
    category.includes('biryani') ||
    name.includes('rice') ||
    name.includes('pilau') ||
    name.includes('pulao')
  ) {
    return 'Rice/Bread';
  }

  if (
    category.includes('side') ||
    category.includes('vegetable') ||
    name.includes('bhaji') ||
    name.includes('saag') ||
    name.includes('aloo') ||
    name.includes('dal') ||
    name.includes('dhal') ||
    name.includes('salad') ||
    name.includes('asparagus') ||
    name.includes('fries') ||
    name.includes('chips')
  ) {
    return 'Side Dishes';
  }

  if (
    category.includes('tandoori') ||
    category.includes('grill') ||
    name.includes('tandoori') ||
    name.includes('shashlik')
  ) {
    return 'Tandoori';
  }

  // Default to Main Dishes
  return 'Main Dishes';
}

export default function PrintableInvoice({
  order,
  template,
  type = 'CUSTOMER', // 'CUSTOMER' | 'KITCHEN'
  restaurant,
}) {
  if (!order) return null;

  const config =
    typeof template?.config === 'string'
      ? (() => {
          try {
            return JSON.parse(template.config);
          } catch (e) {
            return {};
          }
        })()
      : template?.config || {};

  const layout = config.layoutStyle || (type === 'CUSTOMER' ? 'anupam_classic' : 'anupam_course_grouped');
  const baseFontSize = `${template?.fontSize || 12}px`;

  // Format order date/time
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDateTime = orderDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // -------------------------------------------------------------
  // 1. CUSTOMER TEMPLATE: ANUPAM CLASSIC CLIENT BILL
  // -------------------------------------------------------------
  if (type === 'CUSTOMER' && layout === 'anupam_classic') {
    const brand = config.restaurantBrand || restaurant?.name || 'anupam';
    const brandFs = `${config.brandFontSize || 24}px`;
    const legalName = config.legalName || restaurant?.legalName || restaurant?.name || 'Sweet Paan Ltd';
    const address = config.address || restaurant?.address || '85 Church Street\nGreat Malvern WR14 2AE';
    const phone = config.phone || restaurant?.phone || '01684 573814';
    const vatNumber = config.vatNumber || restaurant?.vatNumber || '240 6873 06';
    const businessInfoFs = `${config.businessInfoFontSize || 11}px`;
    const tableNumber = order.tableNumber || config.tableNumber || order.orderNumber || '24/2';
    const tableFs = `${config.tableFontSize || 16}px`;
    const dateFs = `${config.dateFontSize || 11}px`;
    const itemsFs = `${config.itemsFontSize || 12}px`;
    const totalsFs = `${config.totalsFontSize || 12}px`;
    const splitWays = config.splitWays || 2;
    const splitEach = ((order.totalAmount || 0) / splitWays).toFixed(2);
    const splitBillFs = `${config.splitBillFontSize || 12}px`;
    const serviceChargeText = config.serviceChargeText || 'Service Charge Not Included';
    const serviceChargeFs = `${config.serviceChargeFontSize || 12}px`;
    const thankYouText = config.thankYouText || 'Thank You For Your Custom\nPlease Call Again';
    const thankYouFs = `${config.thankYouFontSize || 11}px`;
    const website = config.website || restaurant?.website || 'www.anupam.co.uk';
    const websiteFs = `${config.websiteFontSize || 13}px`;

    return (
      <div
        id="thermal-receipt"
        style={{ fontSize: baseFontSize }}
        className="printable-invoice-container bg-white text-black px-6 py-6 shadow-2xl rounded-sm max-w-[340px] w-full mx-auto space-y-3 text-left border border-slate-200 font-mono tracking-tight"
      >
        {/* Header Brand */}
        <div className="text-center space-y-1">
          <h2 style={{ fontSize: brandFs }} className="font-light tracking-wide lowercase font-sans">
            {brand}
          </h2>
          <div style={{ fontSize: businessInfoFs }} className="text-black font-normal space-y-0.5 leading-snug pt-1">
            <p className="font-bold">{legalName}</p>
            {address.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
            <p className="pt-0.5">
              <span>TelNo:{phone}</span> <span className="ml-1">VATNo:{vatNumber}</span>
            </p>
          </div>
        </div>

        {/* Table & Timestamp */}
        <div className="text-center pt-2">
          <h3 style={{ fontSize: tableFs }} className="font-black tracking-tight">
            Table:( {tableNumber} )
          </h3>
          <p style={{ fontSize: dateFs }} className="text-black">
            {formattedDateTime}
          </p>
        </div>

        {/* Client Info Banner */}
        <div className="border-t border-b border-dashed border-black/70 py-1.5 text-[11px] space-y-0.5">
          <div className="flex justify-between">
            <span className="font-bold">Client:</span>
            <span>{order.customerName}</span>
          </div>
          {order.customerPhone && (
            <div className="flex justify-between">
              <span className="font-bold">Phone:</span>
              <span>{order.customerPhone}</span>
            </div>
          )}
          {order.deliveryAddress && (
            <div className="pt-0.5">
              <span className="font-bold block">Delivery Address:</span>
              <p className="leading-tight text-[10px]">{order.deliveryAddress}</p>
            </div>
          )}
          <div className="flex justify-between pt-0.5 text-[10px] text-slate-700">
            <span>Order Type: {order.orderType}</span>
            <span>{order.paymentMethod === 'CARD_ONLINE' ? 'PAID ONLINE' : 'CASH'}</span>
          </div>
        </div>

        {/* Itemized Dishes List */}
        <div style={{ fontSize: itemsFs }} className="space-y-1 font-normal pt-1">
          {order.items?.map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <span>
                  {item.quantity} {item.itemName}
                </span>
                <span>£{(item.itemTotal || (item.itemPrice || 0) * item.quantity).toFixed(2)}</span>
              </div>
              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <div className="text-[10px] text-slate-600 pl-3">
                  {item.selectedOptions.map((o, oIdx) => (
                    <div key={oIdx} className="flex justify-between">
                      <span>• {o.optionName}</span>
                      {o.optionPrice > 0 && <span>+£{Number(o.optionPrice).toFixed(2)}</span>}
                    </div>
                  ))}
                </div>
              )}
              {item.specialNotes && (
                <p className="text-[10px] italic pl-3 text-slate-700">** {item.specialNotes}</p>
              )}
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div style={{ fontSize: totalsFs }} className="pt-2 space-y-1">
          {config.miscAmount && Number(config.miscAmount) !== 0 && (
            <div className="flex justify-between items-baseline">
              <span>Misc:</span>
              <span>£{Number(config.miscAmount).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-dashed border-black/70 my-1"></div>
          <div className="flex justify-between items-baseline">
            <span>Sub Total:</span>
            <span>£{order.subtotal?.toFixed(2)}</span>
          </div>
          {order.taxAmount > 0 && (
            <div className="flex justify-between items-baseline text-[11px] text-slate-700">
              <span>VAT / Taxes:</span>
              <span>£{order.taxAmount?.toFixed(2)}</span>
            </div>
          )}
          {order.orderType === 'DELIVERY' && order.deliveryFee !== undefined && (
            <div className="flex justify-between items-baseline text-[11px] text-slate-700">
              <span>Delivery Fee:</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `£${order.deliveryFee.toFixed(2)}`}</span>
            </div>
          )}
          <div className="border-t border-dashed border-black/70 my-1"></div>
          <div
            className="flex justify-between items-baseline font-black pt-0.5"
            style={{ fontSize: `calc(${totalsFs} + 3px)` }}
          >
            <span>Total:</span>
            <span>£{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Split Bill */}
        {config.splitBill !== false && (
          <div style={{ fontSize: splitBillFs }} className="flex justify-between pt-1 border-t border-dashed border-black/40">
            <span>Split Bill {splitWays} way</span>
            <span>each £{splitEach}</span>
          </div>
        )}

        {/* Service Charge Note */}
        {config.serviceChargeNote !== false && (
          <div className="text-center pt-2">
            <p style={{ fontSize: serviceChargeFs }} className="font-extrabold tracking-tight">
              {serviceChargeText}
            </p>
          </div>
        )}

        {/* Thank You Note */}
        {config.thankYouNote !== false && (
          <div style={{ fontSize: thankYouFs }} className="text-center space-y-0.5 pt-1">
            {thankYouText.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}

        {/* Website Footer */}
        {website && (
          <div className="text-center pt-2 pb-1">
            <p style={{ fontSize: websiteFs }} className="font-sans font-light">
              {website}
            </p>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. KITCHEN TEMPLATE: ANUPAM COURSE-GROUPED KOT
  // -------------------------------------------------------------
  if (type === 'KITCHEN' && layout === 'anupam_course_grouped') {
    const headerTitle = config.headerTitle || 'Kitchen Copy';
    const headerFs = `${config.headerFontSize || 13}px`;
    const ticketNumber = order.orderNumber?.replace(/[^0-9]/g, '') || config.ticketNumber || '73';
    const ticketNumberFs = `${config.ticketNumberFontSize || 30}px`;
    const categoryFs = `${config.categoryFontSize || 14}px`;
    const subCategoryTitle = config.subCategoryTitle || 'Bread';
    const subCategoryFs = `${config.subCategoryFontSize || 13}px`;
    const itemsFs = `${config.itemsFontSize || 12}px`;
    const specialSection = config.specialSection || '** Tandoori Items **';
    const specialSectionFs = `${config.specialSectionFontSize || 13}px`;
    const tableNumber = order.tableNumber || config.tableNumber || order.orderNumber || '24/2';
    const tableFooterFs = `${config.tableFooterFontSize || 24}px`;
    const dateFooterFs = `${config.dateFooterFontSize || 11}px`;

    // Group items by course
    const starters = [];
    const mainDishes = [];
    const sideDishes = [];
    const riceBread = [];
    const breads = [];
    const tandooriItems = [];

    (order.items || []).forEach((item) => {
      const course = categorizeOrderItem(item);
      if (course === 'Starter(s)') starters.push(item);
      else if (course === 'Side Dishes') sideDishes.push(item);
      else if (course === 'Bread') breads.push(item);
      else if (course === 'Rice/Bread') riceBread.push(item);
      else if (course === 'Tandoori') tandooriItems.push(item);
      else mainDishes.push(item);
    });

    return (
      <div
        id="thermal-receipt"
        style={{ fontSize: baseFontSize }}
        className="printable-invoice-container bg-white text-black px-6 py-6 shadow-2xl rounded-sm max-w-[340px] w-full mx-auto space-y-4 text-left border border-slate-200 font-mono"
      >
        {/* Top Header */}
        <div className="text-center">
          <span style={{ fontSize: headerFs }} className="underline font-bold tracking-wide uppercase">
            {headerTitle} ({order.orderType})
          </span>
          {order.prepMinutes && (
            <p className="text-[11px] font-bold text-slate-800 mt-0.5">Prep Confirmed: {order.prepMinutes} mins</p>
          )}
        </div>

        {/* Large Ticket Callout */}
        <div className="text-center py-1">
          <h2 style={{ fontSize: ticketNumberFs }} className="font-black tracking-widest leading-none">
            ( {ticketNumber} )
          </h2>
        </div>

        {/* Customer / Order Metadata */}
        <div className="border-t border-b border-dashed border-black/70 py-1 text-[11px] flex justify-between">
          <span>Client: <strong>{order.customerName}</strong></span>
          <span>{order.orderNumber}</span>
        </div>

        {/* Course Group: Starter(s) */}
        {starters.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-center">
              <span style={{ fontSize: categoryFs }} className="underline font-bold">
                Starter(s)
              </span>
            </div>
            <div style={{ fontSize: itemsFs }} className="space-y-1">
              {starters.map((it, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex gap-3">
                    <span className="font-bold">{it.quantity}</span>
                    <span className="font-semibold">{it.itemName}</span>
                  </div>
                  {it.selectedOptions?.map((o, oIdx) => (
                    <p key={oIdx} className="text-[10px] pl-6 text-slate-600">+ {o.optionName}</p>
                  ))}
                  {it.specialNotes && <p className="text-[10px] italic pl-6 text-slate-800">** {it.specialNotes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Group: Main Dishes */}
        {mainDishes.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-center">
              <span style={{ fontSize: categoryFs }} className="underline font-bold">
                Main Dishes
              </span>
            </div>
            <div style={{ fontSize: itemsFs }} className="space-y-1">
              {mainDishes.map((it, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex gap-3">
                    <span className="font-bold">{it.quantity}</span>
                    <span className="font-semibold">{it.itemName}</span>
                  </div>
                  {it.selectedOptions?.map((o, oIdx) => (
                    <p key={oIdx} className="text-[10px] pl-6 text-slate-600">+ {o.optionName}</p>
                  ))}
                  {it.specialNotes && <p className="text-[10px] italic pl-6 text-slate-800">** {it.specialNotes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Group: Side Dishes */}
        {sideDishes.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-center">
              <span style={{ fontSize: categoryFs }} className="underline font-bold">
                Side Dishes
              </span>
            </div>
            <div style={{ fontSize: itemsFs }} className="space-y-1">
              {sideDishes.map((it, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex gap-3">
                    <span className="font-bold">{it.quantity}</span>
                    <span className="font-semibold">{it.itemName}</span>
                  </div>
                  {it.selectedOptions?.map((o, oIdx) => (
                    <p key={oIdx} className="text-[10px] pl-6 text-slate-600">+ {o.optionName}</p>
                  ))}
                  {it.specialNotes && <p className="text-[10px] italic pl-6 text-slate-800">** {it.specialNotes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Group: Rice / Bread */}
        {riceBread.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-center">
              <span style={{ fontSize: categoryFs }} className="underline font-bold">
                Rice/Bread
              </span>
            </div>
            <div style={{ fontSize: itemsFs }} className="space-y-1">
              {riceBread.map((it, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex gap-3">
                    <span className="font-bold">{it.quantity}</span>
                    <span className="font-semibold">{it.itemName}</span>
                  </div>
                  {it.selectedOptions?.map((o, oIdx) => (
                    <p key={oIdx} className="text-[10px] pl-6 text-slate-600">+ {o.optionName}</p>
                  ))}
                  {it.specialNotes && <p className="text-[10px] italic pl-6 text-slate-800">** {it.specialNotes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Section: Tandoori / Bread */}
        {(tandooriItems.length > 0 || breads.length > 0) && (
          <div className="space-y-1 pt-1 border-t border-dashed border-black/40">
            {tandooriItems.length > 0 && (
              <div>
                <div className="text-center font-bold">
                  <p style={{ fontSize: specialSectionFs }}>{specialSection}</p>
                </div>
                <div style={{ fontSize: itemsFs }} className="space-y-1 pt-1">
                  {tandooriItems.map((it, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="font-bold">{it.quantity}</span>
                      <span>{it.itemName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {breads.length > 0 && (
              <div className="pt-1">
                <div className="text-center font-bold">
                  <p style={{ fontSize: subCategoryFs }} className="underline">
                    {subCategoryTitle}
                  </p>
                </div>
                <div style={{ fontSize: itemsFs }} className="space-y-1 pt-1">
                  {breads.map((it, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="font-bold">{it.quantity}</span>
                      <span>{it.itemName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* General Order Special Note */}
        {order.specialNotes && (
          <div className="border border-black p-2 text-xs font-bold bg-amber-50">
            <span>Special Order Note: </span>
            <span>{order.specialNotes}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-dashed border-black/70 my-2"></div>

        {/* Table & Timestamp Footer */}
        <div className="text-center space-y-1">
          <h3 style={{ fontSize: tableFooterFs }} className="font-black tracking-tight leading-tight">
            Table:( {tableNumber} )
          </h3>
          <p style={{ fontSize: dateFooterFs }} className="italic font-sans text-black">
            {formattedDateTime}
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. FALLBACK / STANDARD TEMPLATE RENDERER
  // -------------------------------------------------------------
  return (
    <div
      id="thermal-receipt"
      style={{ fontSize: baseFontSize }}
      className="printable-invoice-container bg-white text-black px-6 py-6 shadow-2xl rounded-sm max-w-[340px] w-full mx-auto space-y-3 text-left border border-slate-200 font-mono"
    >
      <div className="text-center space-y-1 border-b border-black pb-2">
        <h2 className="font-bold text-base uppercase">{restaurant?.name || 'BELLA VISTA GOURMET'}</h2>
        <p className="text-[10px]">{restaurant?.address || '742 Evergreen Terrace'}</p>
        <p className="text-[10px]">Tel: {restaurant?.phone || '+1 (555) 345-6789'}</p>
      </div>

      <div className="flex justify-between font-bold text-xs py-1 border-b border-dashed border-black">
        <span>ORDER {order.orderNumber}</span>
        <span>{order.orderType}</span>
      </div>

      <div className="space-y-0.5 text-[11px]">
        <p>Customer: <strong>{order.customerName}</strong></p>
        <p>Phone: {order.customerPhone}</p>
        {order.deliveryAddress && <p>Address: {order.deliveryAddress}</p>}
        <p>Time: {formattedDateTime}</p>
        {order.prepMinutes && <p className="font-bold">Prep Time: {order.prepMinutes} mins</p>}
      </div>

      <div className="border-t border-b border-black py-2 space-y-2">
        {order.items?.map((it, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex justify-between font-bold">
              <span>
                {it.quantity}x {it.itemName}
              </span>
              <span>£{(it.itemTotal || (it.itemPrice || 0) * it.quantity).toFixed(2)}</span>
            </div>
            {it.selectedOptions?.map((o, oIdx) => (
              <p key={oIdx} className="text-[10px] pl-2 text-slate-600">
                + {o.optionName}
              </p>
            ))}
            {it.specialNotes && <p className="text-[10px] italic pl-2">** {it.specialNotes}</p>}
          </div>
        ))}
      </div>

      <div className="space-y-1 text-[11px] pt-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>£{order.subtotal?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>£{order.taxAmount?.toFixed(2)}</span>
        </div>
        {order.orderType === 'DELIVERY' && (
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>£{order.deliveryFee?.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed border-black">
          <span>TOTAL:</span>
          <span>£{order.totalAmount?.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center pt-2 text-[10px]">
        <p>Payment: {order.paymentMethod}</p>
        <p className="pt-1 font-bold">*** {type === 'KITCHEN' ? 'KITCHEN COPY' : 'CUSTOMER RECEIPT'} ***</p>
      </div>
    </div>
  );
}
