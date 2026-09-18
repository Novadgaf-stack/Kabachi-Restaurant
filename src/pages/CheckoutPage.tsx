import React, { useState } from 'react';
import { useCart, SubmittedOrder } from '../context/CartContext';
import {
  formatNaira,
  RESTAURANT_INFO,
  IKOYI_DISTRICTS_LOOKUP,
  getDeliveryFeeByDistrict,
  IkoyiDistrict,
} from '../data/kabachi';
import { PhoneIcon, WhatsAppIcon, ChevronIcon } from '../components/Icons';
import { generateWhatsAppOrderUrl, triggerWhatsAppOpen } from '../utils/whatsappOrder';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    isBelowMinOrder,
    minOrder,
    minOrderRemaining,
    orderType,
    setOrderType,
    selectedDistrict,
    selectedDistrictId,
    setSelectedDistrictId,
    isStoreClosed,
    setCompletedOrder,
    addItem,
    decrementItem,
    removeItem,
  } = useCart();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [gateCode, setGateCode] = useState('');
  const [kitchenNote, setKitchenNote] = useState('');
  const [pickupTime, setPickupTime] = useState('As soon as ready (20–30 mins)');
  const [paymentMethod, setPaymentMethod] = useState<'delivery' | 'pickup' | 'transfer'>(
    orderType === 'delivery' ? 'delivery' : 'pickup'
  );

  // Validation blur states & errors
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedOrderText, setCopiedOrderText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Validate fields on blur (non-blocking for WhatsApp order, but helpful guidance)
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    if (field === 'name') {
      if (value.trim() && value.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters.';
      } else {
        delete newErrors.name;
      }
    }
    if (field === 'phone') {
      const cleaned = value.replace(/[\s-]/g, '');
      if (cleaned && !/^(\+?234|0)[789][01]\d{8}$/.test(cleaned) && cleaned.length < 10) {
        newErrors.phone = 'Please enter a valid phone number (e.g. 0905 841 4398 or +234...).';
      } else {
        delete newErrors.phone;
      }
    }
    if (field === 'address' && orderType === 'delivery') {
      if (value.trim() && value.trim().length < 5) {
        newErrors.address = 'Please provide your full street address with house number.';
      } else {
        delete newErrors.address;
      }
    }
    setErrors(newErrors);
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  // Generate reference like KB-4821
  const generateReference = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `KB-${randomNum}`;
  };

  // District options grouped
  const districtList = Object.values(IKOYI_DISTRICTS_LOOKUP);
  const groupedDistricts = districtList.reduce((acc, dist) => {
    if (!acc[dist.group]) acc[dist.group] = [];
    acc[dist.group].push(dist);
    return acc;
  }, {} as Record<string, IkoyiDistrict[]>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate the current order: make sure at least one item exists
    if (items.length === 0) {
      setOrderError('Your order is empty. Add something from the menu first.');
      return;
    }
    setOrderError('');
    setIsSubmitting(true);

    const reference = generateReference();

    // 2. Build the WhatsApp order message & URL dynamically from CURRENT selected order
    const { url: whatsappUrl, message: formattedMessage } = generateWhatsAppOrderUrl({
      items,
      subtotal,
      deliveryFee,
      total,
      orderType,
      name,
      phone,
      address,
      landmark,
      gateCode,
      selectedDistrict,
      pickupTime,
      kitchenNote,
      paymentMethod,
      reference,
      isStoreClosed,
    });

    const orderData: SubmittedOrder = {
      reference,
      items,
      subtotal,
      deliveryFee,
      total,
      orderType,
      customerName: name.trim() || 'Guest',
      customerPhone: phone.trim() || 'Not specified',
      address: orderType === 'delivery' ? address : undefined,
      landmark: landmark || undefined,
      deliveryZone: orderType === 'delivery' ? selectedDistrict.name : undefined,
      district: selectedDistrict,
      pickupTime: orderType === 'pickup' ? pickupTime : undefined,
      kitchenNote: kitchenNote || undefined,
      paymentMethod,
      rawWhatsAppMessage: formattedMessage,
      whatsappUrl,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCompletedOrder(orderData);

    // 3. Open WhatsApp with the pre-filled order message
    triggerWhatsAppOpen(whatsappUrl);

    // 4. Navigate to confirmation page
    onNavigate('/order/confirm');
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF9F6] min-h-[70vh] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-5 bg-white border border-[#E7E3DC] p-8 sm:p-10 rounded-[12px] elevation-card">
          <span className="section-label text-[#B8090F]">CART EMPTY</span>
          <h1 className="text-2xl sm:text-3xl font-heading italic text-[#111111]">
            Your order is empty
          </h1>
          <p className="text-sm text-[#111111]/70 leading-relaxed">
            Your order is empty. Add something from the menu first.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/menu')}
              className="btn-primary px-8 py-3.5 text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Explore Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => onNavigate('/menu')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]/70 hover:text-[#B8090F] mb-6 focus-ring cursor-pointer transition-colors"
        >
          <ChevronIcon direction="left" className="w-3.5 h-3.5" />
          <span>Back to Menu</span>
        </button>

        <div className="mb-8 space-y-2">
          <span className="section-label text-[#B8090F]">
            DIRECT DISPATCH CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-[#111111]">
            Complete your order.
          </h1>
          <p className="text-sm sm:text-base text-[#111111]/70 max-w-xl">
            Choose delivery or pickup. Delivery fee is computed according to your exact Ikoyi district or Lagos location.
          </p>
        </div>

        {/* Operating hours notice if applicable */}
        {isStoreClosed && (
          <div className="mb-6 p-4 sm:p-5 bg-[#F4F1EC] border border-[#D5D0C7] text-sm text-[#111111] rounded-[8px] elevation-card">
            <p className="font-semibold text-[#B8090F] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B8090F]" />
              <span>Pre-ordering for kitchen opening ({RESTAURANT_INFO.hours}):</span>
            </p>
            <p className="text-xs text-[#111111]/80 mt-1.5 leading-relaxed">
              The wok station is currently preparing for opening. You can still send your order via WhatsApp now; our team will log and queue your dispatch for opening time.
            </p>
          </div>
        )}

        {/* Minimum Order Warning */}
        {isBelowMinOrder && (
          <div className="mb-6 p-4 sm:p-5 bg-[#FFF3CD] border border-[#FFEBAA] text-sm text-[#856404] rounded-[8px]">
            <p className="font-semibold">
              Minimum order is {formatNaira(minOrder)}
            </p>
            <p className="text-xs mt-1">
              Your subtotal is currently {formatNaira(subtotal)}. Add{' '}
              <span className="font-bold">{formatNaira(minOrderRemaining)}</span> more to meet our kitchen threshold.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/menu')}
              className="mt-2.5 text-xs font-semibold text-[#B8090F] hover:underline cursor-pointer inline-block"
            >
              Add more dishes from menu →
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Fulfillment, Contact, Destination (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Custom Luxury Toggle: Delivery vs Pickup */}
            <div className="bg-white p-5 sm:p-6 border border-[#E7E3DC] rounded-[10px] elevation-card space-y-3">
              <label className="section-label text-[#111111]/80 block">
                FULFILLMENT METHOD
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOrderType('delivery');
                    if (paymentMethod === 'pickup') setPaymentMethod('delivery');
                  }}
                  className={`p-4 border rounded-[8px] text-left transition-all cursor-pointer flex items-center justify-between ${
                    orderType === 'delivery'
                      ? 'border-[#9E090F] bg-[#FAF9F6] ring-2 ring-[#9E090F]/20 shadow-xs'
                      : 'border-[#D5D0C7] bg-white hover:bg-[#F4F1EC]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">Direct Delivery</p>
                    <p className="text-xs text-[#111111]/60 mt-0.5">To your home, office, or estate</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      orderType === 'delivery'
                        ? 'border-[#9E090F] bg-[#9E090F]'
                        : 'border-[#A8A49D] bg-white'
                    }`}
                  >
                    {orderType === 'delivery' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrderType('pickup');
                    if (paymentMethod === 'delivery') setPaymentMethod('pickup');
                  }}
                  className={`p-4 border rounded-[8px] text-left transition-all cursor-pointer flex items-center justify-between ${
                    orderType === 'pickup'
                      ? 'border-[#9E090F] bg-[#FAF9F6] ring-2 ring-[#9E090F]/20 shadow-xs'
                      : 'border-[#D5D0C7] bg-white hover:bg-[#F4F1EC]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">Pickup at Restaurant</p>
                    <p className="text-xs text-[#111111]/60 mt-0.5">3b Adekunle Lawal Rd, Ikoyi</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      orderType === 'pickup'
                        ? 'border-[#9E090F] bg-[#9E090F]'
                        : 'border-[#A8A49D] bg-white'
                    }`}
                  >
                    {orderType === 'pickup' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white p-5 sm:p-6 border border-[#E7E3DC] rounded-[10px] elevation-card space-y-4">
              <label className="section-label text-[#111111]/80 block">
                RECIPIENT CONTACT
              </label>

              <div>
                <label htmlFor="customer-name" className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Full Name <span className="text-[#B8090F]">*</span>
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  placeholder="e.g. Tunde Alabi"
                  className={`w-full px-4 py-3 text-sm bg-white border rounded-[6px] text-[#111111] focus-ring transition-colors ${
                    touched.name && errors.name
                      ? 'border-[#B8090F] bg-[#FFF8F8]'
                      : 'border-[#D5D0C7]'
                  }`}
                />
                {touched.name && errors.name && (
                  <p className="text-xs text-[#B8090F] mt-1.5 font-medium">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Phone Number (WhatsApp) <span className="text-[#B8090F]">*</span>
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={(e) => handleBlur('phone', e.target.value)}
                  placeholder="e.g. 0905 841 4398 or +234..."
                  className={`w-full px-4 py-3 text-sm bg-white border rounded-[6px] text-[#111111] focus-ring transition-colors ${
                    touched.phone && errors.phone
                      ? 'border-[#B8090F] bg-[#FFF8F8]'
                      : 'border-[#D5D0C7]'
                  }`}
                />
                {touched.phone && errors.phone && (
                  <p className="text-xs text-[#B8090F] mt-1.5 font-medium">{errors.phone}</p>
                )}
                <p className="text-[11px] text-[#111111]/55 mt-1">
                  Our kitchen dispatch desk coordinates your delivery or pickup directly on WhatsApp.
                </p>
              </div>
            </div>

            {/* Delivery Fields (if Delivery selected) */}
            {orderType === 'delivery' && (
              <div className="bg-white p-5 sm:p-6 border border-[#E7E3DC] rounded-[10px] elevation-card space-y-5">
                <label className="section-label text-[#111111]/80 block">
                  IKOYI DISTRICT & LOCATION
                </label>

                {/* Ikoyi District Lookup Selector */}
                <div>
                  <label htmlFor="ikoyi-district" className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Select Ikoyi District / Delivery Area <span className="text-[#B8090F]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="ikoyi-district"
                      value={selectedDistrictId}
                      onChange={(e) => setSelectedDistrictId(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-[#D5D0C7] rounded-[6px] text-[#111111] focus-ring appearance-none pr-10 cursor-pointer font-medium"
                    >
                      {Object.entries(groupedDistricts).map(([groupName, dists]) => (
                        <optgroup key={groupName} label={groupName}>
                          {dists.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} — {formatNaira(d.fee)} ({d.estimatedMinutes})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-[#111111]/60">
                      <ChevronIcon direction="down" className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Dynamic District Information Box */}
                  <div className="mt-3 p-3.5 bg-[#FAF9F6] border border-[#E7E3DC] rounded-[6px] text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-[#111111]">
                      <span className="font-semibold">{selectedDistrict.name}</span>
                      <span className="font-bold text-[#B8090F] tabular-nums">
                        {formatNaira(selectedDistrict.fee)}
                      </span>
                    </div>
                    <div className="text-[#111111]/70 flex items-center gap-2 text-[11px]">
                      <span>Est. transit: <strong>{selectedDistrict.estimatedMinutes}</strong></span>
                      <span>•</span>
                      <span>Zone: {selectedDistrict.group}</span>
                    </div>
                    {selectedDistrict.securityNote && (
                      <p className="text-[11px] text-[#856404] bg-[#FFF3CD] p-2 rounded-[4px] mt-1 border border-[#FFEBAA]">
                        ℹ️ <strong>Security note:</strong> {selectedDistrict.securityNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label htmlFor="delivery-address" className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Street Address & Flat / Office No. <span className="text-[#B8090F]">*</span>
                  </label>
                  <input
                    id="delivery-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={(e) => handleBlur('address', e.target.value)}
                    placeholder="e.g. 14 Glover Road, Flat 3B"
                    className={`w-full px-4 py-3 text-sm bg-white border rounded-[6px] text-[#111111] focus-ring transition-colors ${
                      touched.address && errors.address
                        ? 'border-[#B8090F] bg-[#FFF8F8]'
                        : 'border-[#D5D0C7]'
                    }`}
                  />
                  {touched.address && errors.address && (
                    <p className="text-xs text-[#B8090F] mt-1.5 font-medium">{errors.address}</p>
                  )}
                </div>

                {/* Nearest Landmark */}
                <div>
                  <label htmlFor="delivery-landmark" className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Nearest Landmark (optional)
                  </label>
                  <input
                    id="delivery-landmark"
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Golden Gate, or Opposite Access Bank"
                    className="w-full px-4 py-3 text-sm bg-white border border-[#D5D0C7] rounded-[6px] text-[#111111] focus-ring"
                  />
                </div>

                {/* Estate Gate Pass / Code (Crucial for Banana Island, Parkview, Osborne) */}
                <div>
                  <label htmlFor="delivery-gatecode" className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Estate Gate Access Code / Pass (if required)
                  </label>
                  <input
                    id="delivery-gatecode"
                    type="text"
                    value={gateCode}
                    onChange={(e) => setGateCode(e.target.value)}
                    placeholder="e.g. Gate code #8492 or Resident pass"
                    className="w-full px-4 py-3 text-sm bg-white border border-[#D5D0C7] rounded-[6px] text-[#111111] focus-ring"
                  />
                  <p className="text-[11px] text-[#111111]/55 mt-1">
                    Ensures our rider clears estate gates without delays.
                  </p>
                </div>

                {/* Note for kitchen */}
                <div>
                  <label htmlFor="delivery-note" className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Special Kitchen Instructions (optional)
                  </label>
                  <input
                    id="delivery-note"
                    type="text"
                    value={kitchenNote}
                    onChange={(e) => setKitchenNote(e.target.value)}
                    placeholder="e.g. Extra spicy wok heat, separate sauce, ring gate bell"
                    className="w-full px-4 py-3 text-sm bg-white border border-[#D5D0C7] rounded-[6px] text-[#111111] focus-ring"
                  />
                </div>
              </div>
            )}

            {/* Pickup Fields (if Pickup selected) */}
            {orderType === 'pickup' && (
              <div className="bg-white p-5 sm:p-6 border border-[#E7E3DC] rounded-[10px] elevation-card space-y-4">
                <label className="section-label text-[#111111]/80 block">
                  PICKUP SCHEDULE
                </label>

                <div>
                  <label htmlFor="pickup-time" className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Estimated Pickup Time
                  </label>
                  <div className="relative">
                    <select
                      id="pickup-time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-[#D5D0C7] rounded-[6px] text-[#111111] focus-ring appearance-none pr-10 cursor-pointer font-medium"
                    >
                      <option value="As soon as ready (20–30 mins)">As soon as ready (20–30 mins)</option>
                      <option value="In 45 minutes">In 45 minutes</option>
                      <option value="In 1 hour">In 1 hour</option>
                      <option value="Later this evening (specify in notes)">Later this evening (specify time below)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-[#111111]/60">
                      <ChevronIcon direction="down" className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF9F6] border border-[#E7E3DC] rounded-[6px] text-xs text-[#111111]/85 space-y-1">
                  <p className="font-semibold text-[#111111]">Pickup Address:</p>
                  <p>{RESTAURANT_INFO.address}</p>
                  <p className="text-[11px] text-[#111111]/60 pt-0.5">
                    Show your order reference number at the host desk or restaurant bar.
                  </p>
                </div>

                <div>
                  <label htmlFor="pickup-note" className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Note for Kitchen or Bar (optional)
                  </label>
                  <input
                    id="pickup-note"
                    type="text"
                    value={kitchenNote}
                    onChange={(e) => setKitchenNote(e.target.value)}
                    placeholder="e.g. Packing for travel, extra napkins"
                    className="w-full px-4 py-3 text-sm bg-white border border-[#D5D0C7] rounded-[6px] text-[#111111] focus-ring"
                  />
                </div>
              </div>
            )}

            {/* Payment Choice */}
            <div className="bg-white p-5 sm:p-6 border border-[#E7E3DC] rounded-[10px] elevation-card space-y-3">
              <label className="section-label text-[#111111]/80 block">
                PAYMENT PREFERENCE
              </label>
              <p className="text-xs text-[#111111]/60">
                Payment is settled directly with the restaurant or rider upon dispatch.
              </p>

              <div className="space-y-2.5 pt-1">
                {orderType === 'delivery' ? (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('delivery')}
                    className={`w-full p-4 border rounded-[8px] text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'delivery'
                        ? 'border-[#9E090F] bg-[#FAF9F6] ring-2 ring-[#9E090F]/20'
                        : 'border-[#D5D0C7] bg-white hover:bg-[#F4F1EC]'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">
                        Pay on Delivery
                      </p>
                      <p className="text-xs text-[#111111]/60 mt-0.5">
                        Cash or POS card swipe with the delivery rider upon arrival
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'delivery' ? 'border-[#9E090F] bg-[#9E090F]' : 'border-[#A8A49D] bg-white'
                      }`}
                    >
                      {paymentMethod === 'delivery' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pickup')}
                    className={`w-full p-4 border rounded-[8px] text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'pickup'
                        ? 'border-[#9E090F] bg-[#FAF9F6] ring-2 ring-[#9E090F]/20'
                        : 'border-[#D5D0C7] bg-white hover:bg-[#F4F1EC]'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">
                        Pay at Pickup
                      </p>
                      <p className="text-xs text-[#111111]/60 mt-0.5">
                        Pay with card or cash at the Kabachi front counter
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'pickup' ? 'border-[#9E090F] bg-[#9E090F]' : 'border-[#A8A49D] bg-white'
                      }`}
                    >
                      {paymentMethod === 'pickup' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`w-full p-4 border rounded-[8px] text-left transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'transfer'
                      ? 'border-[#9E090F] bg-[#FAF9F6] ring-2 ring-[#9E090F]/20'
                      : 'border-[#D5D0C7] bg-white hover:bg-[#F4F1EC]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">
                      Direct Bank Transfer
                    </p>
                    <p className="text-xs text-[#111111]/60 mt-0.5">
                      Instant transfer to Kabachi restaurant corporate account
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'transfer' ? 'border-[#9E090F] bg-[#9E090F]' : 'border-[#A8A49D] bg-white'
                    }`}
                  >
                    {paymentMethod === 'transfer' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              </div>

              {/* Bank Details Box */}
              {paymentMethod === 'transfer' && (
                <div className="mt-3 p-4 bg-[#FAF9F6] border border-[#D5D0C7] rounded-[6px] text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#111111]">Bank Account Details:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${RESTAURANT_INFO.bankTransferDetails.accountNumber}`
                        );
                        setCopiedAccount(true);
                        setTimeout(() => setCopiedAccount(false), 2000);
                      }}
                      className="text-[#9E090F] font-semibold hover:underline cursor-pointer"
                    >
                      {copiedAccount ? '✓ Copied' : 'Copy Account No.'}
                    </button>
                  </div>
                  <div className="font-mono text-xs space-y-0.5 text-[#111111]">
                    <p>Bank: {RESTAURANT_INFO.bankTransferDetails.bankName}</p>
                    <p>Account No: {RESTAURANT_INFO.bankTransferDetails.accountNumber}</p>
                    <p>Account Name: {RESTAURANT_INFO.bankTransferDetails.accountName}</p>
                  </div>
                  <p className="text-[11px] text-[#111111]/60">
                    {RESTAURANT_INFO.bankTransferDetails.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Luxury WhatsApp Action (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white p-6 sm:p-7 border border-[#E7E3DC] rounded-[10px] elevation-card space-y-6">
              <h2 className="text-xl sm:text-2xl font-heading italic text-[#111111] pb-3 border-b border-[#E7E3DC]">
                Order Summary
              </h2>

              {/* Itemized list with dynamic quantity & remove controls */}
              <ul className="divide-y divide-[#E7E3DC] max-h-64 overflow-y-auto pr-1 text-sm">
                {items.map(({ item, quantity }) => (
                  <li key={item.id} className="py-3 flex justify-between items-start gap-2">
                    <div className="pr-1 flex-1">
                      <p className="font-semibold text-[#111111] text-xs sm:text-sm">
                        {quantity}× {item.name}
                      </p>
                      <p className="text-xs text-[#111111]/60 tabular-nums">
                        {formatNaira(item.price)} each
                      </p>

                      {/* Stepper & remove */}
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center border border-[#D5D0C7] rounded-full bg-[#F4F1EC] p-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => decrementItem(item.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-[#111111] hover:bg-white focus-ring cursor-pointer active:scale-95 transition-all"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>
                          <span className="px-2 text-xs font-bold tabular-nums text-[#111111]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => addItem(item)}
                            className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold bg-[#9E090F] text-white hover:bg-[#85080D] focus-ring cursor-pointer active:scale-95 transition-all"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[11px] text-[#111111]/50 hover:text-[#9E090F] underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <span className="font-bold text-[#9E090F] tabular-nums whitespace-nowrap text-xs sm:text-sm pt-0.5">
                      {formatNaira(item.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Tabular live calculation totals */}
              <div className="pt-4 border-t border-[#E7E3DC] space-y-2.5 text-sm">
                <div className="flex justify-between text-[#111111]/80">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums text-[#111111]">
                    {formatNaira(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-[#111111]/80">
                  <span>
                    Delivery ({orderType === 'delivery' ? selectedDistrict.name : 'Customer Pickup'})
                  </span>
                  <span className="font-semibold tabular-nums text-[#111111]">
                    {formatNaira(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base sm:text-xl font-bold text-[#111111] pt-3 border-t border-[#E7E3DC]">
                  <span>Total Due</span>
                  <span className="text-[#9E090F] tabular-nums font-bold">
                    {formatNaira(total)}
                  </span>
                </div>
              </div>

              {/* Empty cart warning if attempted */}
              {orderError && (
                <div className="p-3 bg-[#FFF3CD] border border-[#FFEBAA] text-xs text-[#856404] rounded-[6px]">
                  {orderError}
                </div>
              )}

              {/* Kitchen closed notice */}
              {isStoreClosed && (
                <div className="p-3 bg-[#FFF8E6] border border-[#E8DFC8] rounded-[6px] text-xs text-[#111111]/85 space-y-1">
                  <p className="font-semibold text-[#B8090F]">Kitchen Currently Closed (Hours: {RESTAURANT_INFO.hours})</p>
                  <p className="text-[#111111]/70">
                    Your order will be sent to the Kabachi kitchen WhatsApp as a priority pre-order for opening at 9:00 AM Lagos Time.
                  </p>
                </div>
              )}

              {/* Quality reassurance */}
              <div className="p-3.5 bg-[#FAF9F6] border border-[#E7E3DC] rounded-[6px] text-xs text-[#111111]/75 leading-relaxed">
                <p className="font-semibold text-[#111111] mb-1">
                  How dispatch works:
                </p>
                <p>
                  Clicking below prepares your order and opens WhatsApp directly to <strong>{RESTAURANT_INFO.phone}</strong>. The kitchen team verifies cooking time and assigns your dispatch rider.
                </p>
              </div>

              {/* ORDER NOW BUTTON */}
              <button
                id="order-now-button"
                type="submit"
                disabled={items.length === 0 || isSubmitting}
                className="w-full btn-primary py-4 px-6 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                <span>
                  {isStoreClosed ? 'Order Now (Pre-Order)' : 'Order Now'}
                </span>
                <span className="tabular-nums font-bold ml-1">· {formatNaira(total)}</span>
              </button>

              {/* Desktop Copy Order Fallback */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const sampleRef = generateReference();
                    const { message } = generateWhatsAppOrderUrl({
                      items,
                      subtotal,
                      deliveryFee,
                      total,
                      orderType,
                      name,
                      phone,
                      address,
                      landmark,
                      gateCode,
                      selectedDistrict,
                      pickupTime,
                      kitchenNote,
                      paymentMethod,
                      reference: sampleRef,
                      isStoreClosed,
                    });
                    navigator.clipboard.writeText(message);
                    setCopiedOrderText(true);
                    setTimeout(() => setCopiedOrderText(false), 2500);
                  }}
                  className="text-xs text-[#111111]/70 hover:text-[#9E090F] underline cursor-pointer"
                >
                  {copiedOrderText ? '✓ Order text copied to clipboard!' : 'Copy order as text (Desktop / No WhatsApp)'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
