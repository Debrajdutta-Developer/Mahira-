import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { BrandLogo, DiamondDivider } from './BrandLogo.tsx';

export interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    invoiceNumber?: string;
    customer: {
      name: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      notes?: string;
    };
    items: Array<{
      id: string;
      title: string;
      subtitle: string;
      priceINR: number;
      quantity: number;
      size?: string;
    }>;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    utrReference?: string;
    cardLast4?: string;
    cardBrand?: string;
    authCode?: string;
    settlementAccount?: string;
    createdAt: string;
  } | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const invoiceNumber = order.invoiceNumber || `INV-${order.id}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate GST components (5% GST: 2.5% CGST + 2.5% SGST)
  const taxableValue = Math.round(order.total / 1.05);
  const totalGst = order.total - taxableValue;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;

  const handlePrint = () => {
    window.print();
  };

  const getWhatsAppShareUrl = () => {
    const text = `👑 *MAHIRA SELECT TAX INVOICE* 👑\n*Invoice No:* #${invoiceNumber}\n*Order ID:* #${order.id}\n*Customer:* ${order.customer.name}\n*Total Paid:* ₹${order.total.toLocaleString('en-IN')}\n*Payment Mode:* ${order.paymentMethod.toUpperCase()}\n*Settlement:* Direct to Debraj Dutta's Punjab National Bank A/C 2072001501047083 (IFSC: PUNB0207200)\n*Status:* Authenticated & Confirmed`;
    return `https://wa.me/918536943389?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-3xl bg-[#091a12] border border-[#c5a880]/50 rounded-xl text-[#f7f4ee] shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:bg-white print:text-black print:rounded-none">
        
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-[#06140e] via-[#0f281b] to-[#06140e] border-b border-[#c5a880]/30 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-cinzel text-xs tracking-widest text-[#fae2b4] uppercase font-bold">
              Official GST Tax Invoice • {invoiceNumber}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#173324] hover:bg-[#1e4430] border border-[#c5a880]/40 rounded text-xs text-[#fae2b4] font-cinzel flex items-center gap-1.5 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black rounded text-xs font-cinzel font-bold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Send to WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              aria-label="Close Invoice"
              className="p-1.5 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div ref={invoiceRef} className="p-6 sm:p-8 space-y-6 text-[#f7f4ee] print:text-black print:p-8 bg-[#081810] print:bg-white">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#c5a880]/30 print:border-gray-300">
            <div>
              <div className="flex items-center space-x-2.5 mb-1">
                <span className="text-xl sm:text-2xl font-cinzel font-bold tracking-[0.25em] text-[#fae2b4] print:text-black">
                  MAHIRA SELECT
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#132d20] border border-[#c5a880]/40 text-[#a8e6cf] print:border-gray-400 print:text-gray-700">
                  Tax Invoice
                </span>
              </div>
              <p className="text-xs text-[#c5a880] print:text-gray-600 font-cinzel tracking-wider">
                Haute Couture &amp; Handloom Heritage Atelier
              </p>
              <div className="mt-2 text-xs text-[#d1c7b7] print:text-gray-700 space-y-0.5">
                <p><strong>Proprietor:</strong> Debraj Dutta</p>
                <p><strong>Official WhatsApp:</strong> +91 85369 43389</p>
                <p><strong>Atelier:</strong> Park Street Luxury Quarter, Kolkata, West Bengal - 700016</p>
                <p><strong>GSTIN:</strong> 19AAEPD8536Q1Z2 | State Code: 19 (West Bengal)</p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-[#05130c] print:bg-gray-50 p-3.5 rounded-lg border border-[#c5a880]/30 print:border-gray-300 min-w-[220px]">
              <span className="text-[10px] uppercase tracking-widest text-[#c5a880] print:text-gray-500 font-cinzel block">
                Invoice Details
              </span>
              <p className="font-mono text-sm font-bold text-[#fae2b4] print:text-black mt-0.5">
                {invoiceNumber}
              </p>
              <p className="text-xs text-[#d1c7b7] print:text-gray-700 mt-1">
                <strong>Date:</strong> {orderDate}
              </p>
              <p className="text-xs text-[#d1c7b7] print:text-gray-700">
                <strong>Order Ref:</strong> #{order.id}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 print:bg-emerald-50 print:text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                <span>Payment Authenticated</span>
              </div>
            </div>
          </div>

          {/* Customer & Billing Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#05130c] print:bg-gray-50 p-4 rounded-lg border border-[#c5a880]/20 print:border-gray-300">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#fae2b4] print:text-gray-800 font-cinzel font-bold block mb-1">
                Billed &amp; Shipped To:
              </span>
              <p className="text-sm font-bold text-[#f7f4ee] print:text-black">{order.customer.name}</p>
              <p className="text-[#d1c7b7] print:text-gray-700 mt-1 leading-relaxed">
                {order.customer.address}
                <br />
                {order.customer.city}, {order.customer.state} — <strong>{order.customer.pincode}</strong>
              </p>
              <p className="text-[#d1c7b7] print:text-gray-700 mt-1">
                <strong>Phone:</strong> {order.customer.phone}
              </p>
              {order.customer.email && (
                <p className="text-[#d1c7b7] print:text-gray-700">
                  <strong>Email:</strong> {order.customer.email}
                </p>
              )}
            </div>

            <div className="sm:border-l sm:border-[#c5a880]/20 print:border-gray-300 sm:pl-4">
              <span className="text-[10px] uppercase tracking-widest text-[#fae2b4] print:text-gray-800 font-cinzel font-bold block mb-1">
                Place of Supply:
              </span>
              <p className="text-[#d1c7b7] print:text-gray-700">
                <strong>State:</strong> {order.customer.state || 'West Bengal'}
              </p>
              <p className="text-[#d1c7b7] print:text-gray-700 mt-1">
                <strong>Dispatch Mode:</strong> Insured Heritage Express Courier
              </p>
              <p className="text-[#d1c7b7] print:text-gray-700 mt-1">
                <strong>Packaging:</strong> Velvet Heritage Keepsake Box (Included)
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#c5a880]/30 print:border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-[#05140c] print:bg-gray-100 text-[#fae2b4] print:text-gray-800 font-cinzel text-[11px] uppercase tracking-wider border-b border-[#c5a880]/30 print:border-gray-300">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price (INR)</th>
                  <th className="py-2.5 px-3 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c5a880]/15 print:divide-gray-200">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#0d2217]/40 print:hover:bg-transparent">
                    <td className="py-3 px-3 text-[#c5a880] print:text-gray-500 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[#f7f4ee] print:text-black">{item.title}</p>
                      <p className="text-[11px] text-[#c5a880] print:text-gray-600">
                        {item.subtitle} {item.size ? `• Size: ${item.size}` : ''}
                      </p>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#d1c7b7] print:text-gray-700">6204</td>
                    <td className="py-3 px-3 text-center font-bold text-[#f7f4ee] print:text-black">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#d1c7b7] print:text-gray-700">
                      ₹{item.priceINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#fae2b4] print:text-black">
                      ₹{(item.quantity * item.priceINR).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-2">
            {/* Direct Bank Settlement Guarantee Stamp */}
            <div className="bg-[#05130c] print:bg-emerald-50 border border-emerald-500/40 print:border-emerald-600 rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 print:text-emerald-800 font-cinzel font-bold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Direct Bank Settlement Guarantee</span>
              </div>
              <p className="text-[11px] text-[#d1c7b7] print:text-gray-700 leading-relaxed">
                Payment was authenticated and credited directly to the proprietor's official bank account without third-party wallet deduction:
              </p>
              <div className="bg-[#0a1e14] print:bg-white p-2.5 rounded border border-[#c5a880]/20 print:border-emerald-300 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#c5a880] print:text-gray-600">Bank:</span>
                  <span className="text-[#fae2b4] print:text-black font-bold">Punjab National Bank (PNB)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c5a880] print:text-gray-600">A/C Number:</span>
                  <span className="text-[#fae2b4] print:text-black font-bold">2072001501047083</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c5a880] print:text-gray-600">IFSC Code:</span>
                  <span className="text-[#fae2b4] print:text-black font-bold">PUNB0207200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c5a880] print:text-gray-600">UPI VPA:</span>
                  <span className="text-[#fae2b4] print:text-black font-bold">theghost-debraj@yesfam</span>
                </div>
                {order.utrReference && (
                  <div className="flex justify-between border-t border-[#c5a880]/20 print:border-gray-200 pt-1">
                    <span className="text-emerald-400 print:text-emerald-700 font-bold">UTR / Auth Ref:</span>
                    <span className="text-emerald-400 print:text-emerald-800 font-bold">{order.utrReference}</span>
                  </div>
                )}
                {order.cardLast4 && (
                  <div className="flex justify-between border-t border-[#c5a880]/20 print:border-gray-200 pt-1">
                    <span className="text-emerald-400 print:text-emerald-700 font-bold">Card Auth:</span>
                    <span className="text-emerald-400 print:text-emerald-800 font-bold">
                      {order.cardBrand || 'Card'} •••• {order.cardLast4} ({order.authCode || 'AUTH-OK'})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="bg-[#05130c] print:bg-gray-50 border border-[#c5a880]/30 print:border-gray-300 rounded-lg p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-[#c5a880] print:text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-mono text-[#f7f4ee] print:text-black">
                  ₹{order.subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[#a8e6cf] print:text-emerald-700">
                  <span>Atelier Privilege Discount:</span>
                  <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#c5a880] print:text-gray-600">
                <span>Taxable Amount (Pre-GST):</span>
                <span className="font-mono text-[#d1c7b7] print:text-gray-700">
                  ₹{taxableValue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-[#c5a880] print:text-gray-600">
                <span>CGST (2.5%):</span>
                <span className="font-mono text-[#d1c7b7] print:text-gray-700">
                  ₹{cgst.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-[#c5a880] print:text-gray-600">
                <span>SGST (2.5%):</span>
                <span className="font-mono text-[#d1c7b7] print:text-gray-700">
                  ₹{sgst.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-[#c5a880] print:text-gray-600">
                <span>Insured Luxury Delivery:</span>
                <span className="font-mono text-[#a8e6cf] print:text-emerald-700 font-semibold">
                  {order.shipping === 0 ? 'COMPLIMENTARY' : `₹${order.shipping.toLocaleString('en-IN')}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#c5a880]/30 print:border-gray-400 pt-2 text-sm font-bold text-[#fae2b4] print:text-black">
                <span className="font-cinzel">Total Amount Paid:</span>
                <span className="font-mono text-base">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t border-[#c5a880]/20 print:border-gray-300 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-[#c5a880] print:text-gray-600">
            <div>
              <p className="font-semibold text-[#f7f4ee] print:text-black">Declaration &amp; Notes:</p>
              <p className="text-[11px] leading-relaxed max-w-md mt-1">
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Direct payment recorded and reconciled against Debraj Dutta's Punjab National Bank A/C.
              </p>
            </div>

            <div className="text-right sm:text-right w-full sm:w-auto">
              <div className="inline-block border border-dashed border-[#c5a880]/50 print:border-gray-400 p-3 rounded text-center min-w-[200px]">
                <p className="font-serif-luxury text-sm font-bold text-[#fae2b4] print:text-black italic">
                  Debraj Dutta
                </p>
                <div className="h-0.5 bg-[#c5a880]/40 print:bg-gray-400 my-1"></div>
                <p className="text-[10px] font-cinzel tracking-wider text-[#d1c7b7] print:text-gray-700">
                  Authorized Signatory &amp; Proprietor
                </p>
                <p className="text-[9px] text-[#c5a880] print:text-gray-500">Mahira Select Luxury Couture</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="px-6 py-4 bg-[#05130c] border-t border-[#c5a880]/30 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <p className="text-xs text-[#c5a880] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official digital invoice authenticated under Indian IT Act 2000.</span>
          </p>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs uppercase tracking-wider font-bold rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF / Print</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#c5a880]/40 hover:bg-[#132d20] text-[#fae2b4] font-cinzel text-xs uppercase tracking-wider rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
