import { CartItem } from '../context/CartContext';
import { RESTAURANT_INFO, IkoyiDistrict } from '../data/kabachi';

/**
 * Format currency strictly as ASCII-safe "NGN X,XXX"
 * Never uses currency symbols like ₦ that may cause encoding corruption in WhatsApp.
 */
export function formatNGN(amount: number): string {
  const rounded = Math.round(amount);
  return `NGN ${rounded.toLocaleString('en-US')}`;
}

export interface BuildOrderMessageParams {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: 'delivery' | 'pickup';
  name?: string;
  phone?: string;
  address?: string;
  landmark?: string;
  gateCode?: string;
  selectedDistrict?: IkoyiDistrict;
  pickupTime?: string;
  kitchenNote?: string;
  paymentMethod?: 'delivery' | 'pickup' | 'transfer';
  reference: string;
  isStoreClosed?: boolean;
}

/**
 * Dynamically builds a clean, professional, ASCII-safe plain-text WhatsApp order message.
 * Strict rules:
 * - NO emojis
 * - NO decorative symbols
 * - NO broken unicode or smart quotes
 * - Strict NGN formatting
 * - Clear ## ORDER DETAILS and ## CUSTOMER DETAILS sections
 * - Strictly restaurant food order information (no lodge data)
 */
export function buildWhatsAppOrderMessage(params: BuildOrderMessageParams): string {
  const {
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
  } = params;

  // 1. Build plain text item lines: "1 x Dish Name - NGN X,XXX"
  const itemLines = items.map(({ item, quantity }) => {
    const lineTotal = formatNGN(item.price * quantity);
    return `${quantity} x ${item.name} - ${lineTotal}`;
  });

  // 2. Build financial breakdown
  const financialLines: string[] = [];
  financialLines.push(`Subtotal: ${formatNGN(subtotal)}`);
  if (orderType === 'delivery') {
    const districtName = selectedDistrict?.name || 'Ikoyi';
    financialLines.push(`Delivery Fee (${districtName}): ${formatNGN(deliveryFee)}`);
  }
  financialLines.push(`Total: ${formatNGN(total)}`);

  // 3. Build customer & fulfillment block
  const customerLines: string[] = [];
  const customerName = name && name.trim() ? name.trim() : 'Guest';
  const customerPhone = phone && phone.trim() ? phone.trim() : 'Not provided';
  customerLines.push(`Name: ${customerName}`);
  customerLines.push(`Phone: ${customerPhone}`);
  customerLines.push(`Order Type: ${orderType === 'delivery' ? 'Delivery' : 'Pickup'}`);

  if (orderType === 'delivery') {
    let fullAddress = address && address.trim() ? address.trim() : 'Address not specified';
    if (landmark && landmark.trim()) {
      fullAddress += ` (Landmark: ${landmark.trim()})`;
    }
    if (gateCode && gateCode.trim()) {
      fullAddress += ` (Gate Code: ${gateCode.trim()})`;
    }
    customerLines.push(`Delivery Address: ${fullAddress}`);
  } else {
    customerLines.push(`Pickup Location: Kabachi (3b Adekunle Lawal Rd, Ikoyi)`);
    if (pickupTime && pickupTime.trim()) {
      customerLines.push(`Pickup Time: ${pickupTime.trim()}`);
    }
  }

  if (paymentMethod) {
    const paymentDesc =
      paymentMethod === 'transfer'
        ? 'Direct Bank Transfer'
        : orderType === 'delivery'
        ? 'Pay on Delivery (Cash/POS with rider)'
        : 'Pay at Pickup';
    customerLines.push(`Payment Method: ${paymentDesc}`);
  }

  if (reference) {
    customerLines.push(`Order Reference: ${reference}`);
  }

  // Assemble the message sections
  const sections: string[] = [];
  sections.push('Hello Kabachi Staff,\n\nI would like to place a food order.');

  sections.push(`## ORDER DETAILS\n\n${itemLines.join('\n')}\n\n${financialLines.join('\n')}`);

  sections.push(`## CUSTOMER DETAILS\n\n${customerLines.join('\n')}`);

  if (kitchenNote && kitchenNote.trim()) {
    sections.push(`Special Instructions:\n${kitchenNote.trim()}`);
  }

  if (isStoreClosed) {
    sections.push(`Notice: Order submitted outside kitchen hours (9:00 AM - 10:00 PM Lagos Time). Please confirm cooking slot for opening.`);
  }

  sections.push('Please confirm the order and let me know when it is ready.\n\nThank you.');

  return sections.join('\n\n');
}

/**
 * Builds the complete WhatsApp click-to-chat URL with properly encoded message
 */
export function generateWhatsAppOrderUrl(params: BuildOrderMessageParams): { url: string; message: string } {
  const message = buildWhatsAppOrderMessage(params);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encoded}`;
  return { url, message };
}

export interface BuildLodgeInquiryParams {
  guestName?: string;
  phone?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number | string;
  numberOfRooms?: number | string;
  roomType?: string;
  notes?: string;
}

/**
 * Builds a strictly separate, ASCII-safe Lodge Inquiry WhatsApp message.
 * Strictly contains NO food cart items, NO food prices, NO restaurant totals.
 */
export function buildWhatsAppLodgeInquiryMessage(params?: BuildLodgeInquiryParams): string {
  if (!params || (!params.guestName && !params.checkInDate)) {
    return (
      'Hello Kabachi Lodge Staff,\n\n' +
      'I would like to inquire about room availability, nightly rates, and reservations at Kabachi Lodge upstairs in Ikoyi.\n\n' +
      'Please share available dates and check-in details.\n\n' +
      'Thank you.'
    );
  }

  const sections: string[] = [];
  sections.push('Hello Kabachi Lodge Staff,\n\nI would like to inquire about room availability and reservations.');

  const guestLines: string[] = [];
  if (params.guestName && params.guestName.trim()) {
    guestLines.push(`Name: ${params.guestName.trim()}`);
  }
  if (params.phone && params.phone.trim()) {
    guestLines.push(`Phone: ${params.phone.trim()}`);
  }
  if (guestLines.length > 0) {
    sections.push(`## GUEST DETAILS\n\n${guestLines.join('\n')}`);
  }

  const inquiryLines: string[] = [];
  inquiryLines.push('Location: Kabachi Lodge Upstairs (3b Adekunle Lawal Rd, Ikoyi, Lagos)');
  inquiryLines.push(`Room Type: ${params.roomType || 'Private En-suite Lodge Bedroom'}`);
  if (params.checkInDate) {
    inquiryLines.push(`Check-in Date: ${params.checkInDate}`);
  }
  if (params.checkOutDate) {
    inquiryLines.push(`Check-out Date: ${params.checkOutDate}`);
  }
  if (params.numberOfGuests) {
    inquiryLines.push(`Number of Guests: ${params.numberOfGuests}`);
  }
  if (params.numberOfRooms) {
    inquiryLines.push(`Number of Rooms: ${params.numberOfRooms}`);
  }
  sections.push(`## RESERVATION INQUIRY\n\n${inquiryLines.join('\n')}`);

  if (params.notes && params.notes.trim()) {
    sections.push(`Special Requests:\n${params.notes.trim()}`);
  }

  sections.push('Please confirm room availability and current nightly rates.\n\nThank you.');

  return sections.join('\n\n');
}

/**
 * Builds the complete WhatsApp URL for lodge bookings
 */
export function generateWhatsAppLodgeUrl(params?: BuildLodgeInquiryParams): string {
  const message = buildWhatsAppLodgeInquiryMessage(params);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encoded}`;
}

/**
 * Reliably opens the WhatsApp URL across mobile, desktop, and iframe sandboxes
 */
export function triggerWhatsAppOpen(url: string): void {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = url;
    }
  }
}
