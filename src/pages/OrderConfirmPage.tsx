import React, { useState } from 'react';
import { useCart, SubmittedOrder } from '../context/CartContext';
import { formatNaira, RESTAURANT_INFO } from '../data/kabachi';
import { PhoneIcon, WhatsAppIcon, ChevronIcon } from '../components/Icons';

interface OrderConfirmPageProps {
  onNavigate: (path: string) => void;
}

export function OrderConfirmPage({ onNavigate }: OrderConfirmPageProps) {
  const { completedOrder, clearCart } = useCart();
  const [copied, setCopied] = useState(false);

  // Fallback if user lands directly on confirm page
  const order: SubmittedOrder = completedOrder || {
    reference: 'KB-DEMO',
    items: [],
    subtotal: 18500,
    deliveryFee: 1200,
    total: 19700,
    orderType: 'delivery',
    customerName: 'Valued Guest',
    customerPhone: '0905 841 4398',
    deliveryZone: 'Gerard Road / Kingsway Road',
    address: 'Adekunle Lawal Rd, Ikoyi',
    paymentMethod: 'delivery',
    rawWhatsAppMessage: 'Demo order reference KB-DEMO',
    whatsappUrl: `https://wa.me/${RESTAURANT_INFO.whatsappNumber}`,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(order.rawWhatsAppMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrderAgain = () => {
    clearCart();
    onNavigate('/menu');
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation back */}
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]/70 hover:text-[#9E090F] focus-ring cursor-pointer transition-colors"
        >
          <ChevronIcon direction="left" className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Confirmation Card */}
        <div className="bg-white border border-[#E7E3DC] rounded-[12px] p-6 sm:p-10 elevation-card space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b border-[#E7E3DC]">
            <span className="section-label text-[#9E090F]">
              ORDER DISPATCHED
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading italic text-[#111111]">
              Thank you, {order.customerName.split(' ')[0] || 'Guest'}.
            </h1>
            <p className="text-sm text-[#111111]/70">
              Reference: <strong className="font-mono text-[#9E090F] text-base">{order.reference}</strong>
            </p>
          </div>

          {/* Dispatch Notice */}
          <div className="p-4 sm:p-5 bg-[#FAF9F6] border border-[#E7E3DC] rounded-[8px] text-sm text-[#111111]/85 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#111111]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9E090F]" />
              <span>Sent to Kabachi Kitchen Dispatch</span>
            </div>
            <p className="text-xs text-[#111111]/75 leading-relaxed">
              Your order message was compiled and formatted for our kitchen line ({RESTAURANT_INFO.phone}). The culinary team checks receipt, confirms preparation time, and coordinates rider pickup.
            </p>
          </div>

          {/* Customer & Fulfillment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FAF9F6] border border-[#E7E3DC] rounded-[8px] space-y-1">
              <span className="section-label text-[#111111]/60 block text-[10px]">
                CUSTOMER
              </span>
              <p className="font-semibold text-sm text-[#111111]">{order.customerName}</p>
              <p className="text-[#111111]/70">{order.customerPhone}</p>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-[#E7E3DC] rounded-[8px] space-y-1">
              <span className="section-label text-[#111111]/60 block text-[10px]">
                FULFILLMENT
              </span>
              <p className="font-semibold text-sm text-[#111111] capitalize">
                {order.orderType === 'delivery' ? 'Direct Delivery' : 'Pickup at Restaurant'}
              </p>
              <p className="text-[#111111]/75 truncate">
                {order.orderType === 'delivery'
                  ? order.district?.name || order.address || order.deliveryZone || 'Ikoyi / Lagos'
                  : '3b Adekunle Lawal Rd, Ikoyi'}
              </p>
              {order.district?.estimatedMinutes && (
                <p className="text-[11px] text-[#9E090F] font-medium pt-0.5">
                  Est. transit: {order.district.estimatedMinutes}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Order Breakdown */}
          {order.items.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="section-label text-[#111111]/80">
                ITEMS ORDERED
              </h2>
              <ul className="divide-y divide-[#E7E3DC] border-t border-b border-[#E7E3DC]">
                {order.items.map(({ item, quantity }) => (
                  <li key={item.id} className="py-3 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-[#111111]">{quantity}× {item.name}</span>
                      <span className="text-[#111111]/55 ml-2">({formatNaira(item.price)} each)</span>
                    </div>
                    <span className="font-bold text-[#9E090F] tabular-nums">
                      {formatNaira(item.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Totals table */}
              <div className="space-y-2 text-xs text-[#111111]/80 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums text-[#111111]">
                    {formatNaira(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee ({order.district?.name || (order.orderType === 'delivery' ? 'Ikoyi Area' : 'Pickup')})</span>
                  <span className="font-semibold tabular-nums text-[#111111]">
                    {formatNaira(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#111111] pt-2.5 border-t border-[#E7E3DC]">
                  <span>Total</span>
                  <span className="text-[#9E090F] tabular-nums font-bold text-lg">
                    {formatNaira(order.total)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* First-class Buttons: "Call the restaurant" and "Order again" */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
              className="btn-secondary py-3.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneIcon className="w-4 h-4 text-[#111111]" />
              <span>Call restaurant</span>
            </a>

            <button
              type="button"
              onClick={handleOrderAgain}
              className="btn-primary py-3.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center cursor-pointer"
            >
              Order again
            </button>
          </div>

          {/* WhatsApp reopen and Copy details fallback */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-[#E7E3DC]">
            <a
              href={order.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9E090F] font-semibold flex items-center gap-1.5 hover:underline"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Re-open WhatsApp chat message</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="text-[#111111]/70 hover:text-[#111111] underline cursor-pointer"
            >
              {copied ? '✓ Order details copied' : 'Copy order message text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
