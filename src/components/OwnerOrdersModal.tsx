import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Settings,
  MessageCircle,
  Check,
  RefreshCw,
  Search,
  Building2,
  QrCode,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  FileText,
  ShieldCheck,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { InvoiceModal } from './InvoiceModal.tsx';

interface OrderItem {
  id: string;
  title: string;
  subtitle: string;
  priceINR: number;
  quantity: number;
  size?: string;
}

interface OrderRecord {
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
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  utrReference?: string;
  utrReconciliationStatus?: 'pending_bank_audit' | 'reconciled' | 'duplicate_flagged' | 'rejected_fraud';
  reconciliationNotes?: string;
  cardLast4?: string;
  cardBrand?: string;
  authCode?: string;
  settlementAccount?: string;
  createdAt: string;
  whatsappUrl?: string;
  ownerNotifiedAt?: string;
}

interface OwnerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerOrdersModal: React.FC<OwnerOrdersModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'orders' | 'settings'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderRecord | null>(null);
  const [auditingOrder, setAuditingOrder] = useState<OrderRecord | null>(null);
  const [auditNotes, setAuditNotes] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);

  // Gateway Settings
  const [whatsappNumber, setWhatsappNumber] = useState('8536943389');
  const [upiId, setUpiId] = useState('theghost-debraj@yesfam');
  const [accountHolder, setAccountHolder] = useState('Debraj Dutta (Mahira Select)');
  const [accountNumber, setAccountNumber] = useState('2072001501047083');
  const [ifsc, setIfsc] = useState('PUNB0207200');
  const [bankName, setBankName] = useState('Punjab National Bank (PNB)');
  const [branch, setBranch] = useState('Kolkata Branch');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchOrdersAndConfig = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, configRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/config'),
      ]);

      const ordersData = await ordersRes.json();
      if (ordersData.success && ordersData.orders) {
        setOrders(ordersData.orders);
      }

      const configData = await configRes.json();
      if (configData.success && configData.config) {
        const c = configData.config;
        setWhatsappNumber(c.whatsappNumber || '8536943389');
        setUpiId(c.upiId || 'theghost-debraj@yesfam');
        if (c.bankDetails) {
          setAccountHolder(c.bankDetails.accountHolder || 'Debraj Dutta (Mahira Select)');
          setAccountNumber(c.bankDetails.accountNumber || '2072001501047083');
          setIfsc(c.bankDetails.ifsc || 'PUNB0207200');
          setBankName(c.bankDetails.bankName || 'Punjab National Bank (PNB)');
          setBranch(c.bankDetails.branch || 'Kolkata Branch');
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders / config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrdersAndConfig();
    }
  }, [isOpen]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsappNumber,
          upiId,
          bankDetails: {
            accountHolder,
            accountNumber,
            ifsc,
            bankName,
            branch,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // UTR Bank Statement Reconciliation Action
  const handleReconcileUtr = async (orderId: string, status: 'reconciled' | 'rejected_fraud') => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/payment/reconcile-utr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status,
          notes: auditNotes || (status === 'reconciled' ? 'Matched with PNB statement credit' : 'No credit found in PNB statement'),
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (auditingOrder?.id === orderId) {
          setAuditingOrder(data.order);
        }
      }
    } catch (err) {
      console.error('Failed to reconcile UTR:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.includes(q) ||
      (o.utrReference && o.utrReference.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-[#071710] border border-[#c5a880]/40 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#f7f4ee]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#c5a880]/30 flex items-center justify-between bg-[#0a1f16]">
            <div className="flex items-center space-x-3">
              <BrandLogo size="sm" showSubtitle={false} />
              <div>
                <h3 className="font-serif-luxury text-lg text-[#fae2b4] flex items-center gap-2">
                  <span>Merchant Portal &amp; PNB Direct Gateway</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#173827] text-emerald-300 font-cinzel font-normal border border-emerald-500/30">
                    Proprietor: Debraj Dutta
                  </span>
                </h3>
                <p className="text-xs text-[#c5a880]">
                  Live Orders, PNB Settlement Audits, UTR Fraud Checks &amp; Invoices
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#c5a880]/20 bg-[#06140e] px-4 text-xs font-cinzel tracking-wider">
            <button
              onClick={() => setTab('orders')}
              className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 ${
                tab === 'orders'
                  ? 'border-[#fae2b4] text-[#fae2b4]'
                  : 'border-transparent text-[#c5a880] hover:text-[#fae2b4]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders &amp; Payment Ledger ({orders.length})</span>
            </button>

            <button
              onClick={() => setTab('settings')}
              className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 ${
                tab === 'settings'
                  ? 'border-[#fae2b4] text-[#fae2b4]'
                  : 'border-transparent text-[#c5a880] hover:text-[#fae2b4]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Gateway &amp; PNB Settlement Settings</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {/* Orders Tab */}
            {tab === 'orders' && (
              <div className="space-y-4">
                {/* Anti-Fraud Banner */}
                <div className="p-3 bg-[#0a1e14] border border-[#c5a880]/30 rounded-lg flex items-start gap-2.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-[#e6ded0] space-y-0.5">
                    <strong className="text-[#fae2b4] font-cinzel">Direct PNB Settlement &amp; Anti-Fraud Shield Active:</strong>
                    <p className="text-[11px] text-[#c5a880]">
                      The checkout engine automatically blocks duplicate UTR numbers across orders. When a customer enters a UTR, cross-match it against your Punjab National Bank SMS alert / mPassbook for ₹{'{amount}'} before dispatching orders.
                    </p>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-[#c5a880] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by customer name, phone, order #, UTR..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#06140e] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/60 focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                  <button
                    onClick={fetchOrdersAndConfig}
                    className="px-3 py-2 text-xs border border-[#c5a880]/30 rounded hover:bg-[#132d20] text-[#c5a880] flex items-center gap-1 font-cinzel w-full sm:w-auto justify-center"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh Ledger</span>
                  </button>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-[#c5a880]">
                    <ShoppingBag className="w-10 h-10 mx-auto stroke-1 mb-2 opacity-50" />
                    <p className="font-serif-luxury text-lg text-[#fae2b4]">No orders found</p>
                    <p className="text-xs text-[#c5a880] mt-1">
                      When customers place orders via Dynamic UPI QR, Card, or WhatsApp, they appear here live.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => {
                      const reconStatus = order.utrReconciliationStatus || 'pending_bank_audit';
                      return (
                        <div
                          key={order.id}
                          className="p-4 bg-[#06140e] border border-[#c5a880]/30 rounded-lg space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c5a880]/15 pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-sm text-[#fae2b4]">
                                #{order.id}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-[#132d20] text-emerald-300 uppercase font-cinzel font-semibold">
                                {order.paymentMethod} • Settled to PNB
                              </span>

                              {/* Reconciliation status badge for UPI */}
                              {order.paymentMethod === 'upi' && (
                                <>
                                  {reconStatus === 'reconciled' && (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-cinzel">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>PNB Credit Matched</span>
                                    </span>
                                  )}
                                  {reconStatus === 'pending_bank_audit' && (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-cinzel">
                                      <AlertTriangle className="w-3 h-3" />
                                      <span>Pending PNB Audit</span>
                                    </span>
                                  )}
                                  {reconStatus === 'rejected_fraud' && (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/40 flex items-center gap-1 font-cinzel">
                                      <XCircle className="w-3 h-3" />
                                      <span>Fake / Uncredited UTR Flagged</span>
                                    </span>
                                  )}
                                </>
                              )}
                            </div>

                            <div className="text-xs text-[#c5a880] flex items-center gap-1 font-sans">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(order.createdAt).toLocaleString('en-IN', {
                                  timeZone: 'Asia/Kolkata',
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="font-semibold text-[#f7f4ee]">{order.customer.name}</p>
                              <p className="text-[#c5a880] flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" />
                                <span>{order.customer.phone}</span>
                              </p>
                              {order.customer.email && (
                                <p className="text-[#c5a880] flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  <span>{order.customer.email}</span>
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="text-[#c5a880] flex items-start gap-1">
                                <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                <span>
                                  {order.customer.address}, {order.customer.city}, {order.customer.state} -{' '}
                                  {order.customer.pincode}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Items & Payment Info */}
                          <div className="bg-[#091a12] p-2.5 rounded border border-[#c5a880]/15 text-xs space-y-1">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-[#e6ded0]">
                                <span>
                                  {it.quantity}x {it.title} {it.size ? `(${it.size})` : ''}
                                </span>
                                <span className="text-[#fae2b4]">
                                  ₹{(it.quantity * it.priceINR).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                            <div className="flex justify-between font-bold text-[#fae2b4] pt-1.5 border-t border-[#c5a880]/15">
                              <span>Grand Total</span>
                              <span>₹{order.total.toLocaleString('en-IN')}</span>
                            </div>

                            {order.utrReference && (
                              <div className="pt-1 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                                <span className="text-emerald-400 font-mono">
                                  Bank UTR Reference: <strong className="text-[#fae2b4]">{order.utrReference}</strong>
                                </span>
                                <span className="text-[#c5a880] font-sans">
                                  Settling to PNB A/C ****7083
                                </span>
                              </div>
                            )}

                            {order.cardLast4 && (
                              <p className="text-[11px] text-emerald-400 font-mono">
                                Card Authorized: {order.cardBrand} •••• {order.cardLast4} (Auth Code: {order.authCode || 'PNB-AUTH'})
                              </p>
                            )}

                            {order.reconciliationNotes && (
                              <p className="text-[10px] text-[#fae2b4] italic bg-[#05100b] p-1.5 rounded border border-[#c5a880]/20 mt-1">
                                Audit Note: {order.reconciliationNotes}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap justify-end gap-2 pt-1">
                            {/* UTR Bank Audit Tool (For UPI orders) */}
                            {order.paymentMethod === 'upi' && (
                              <button
                                onClick={() => {
                                  setAuditingOrder(order);
                                  setAuditNotes(order.reconciliationNotes || '');
                                }}
                                className="px-3 py-1.5 bg-[#1b2b1e] hover:bg-[#253d2b] border border-amber-500/40 text-amber-200 font-cinzel text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                <span>Audit UTR in PNB</span>
                              </button>
                            )}

                            {/* View Tax Invoice Button */}
                            <button
                              onClick={() => setSelectedInvoiceOrder(order)}
                              className="px-3 py-1.5 bg-[#173324] hover:bg-[#1e4430] border border-[#c5a880]/40 text-[#fae2b4] font-cinzel text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Tax Invoice</span>
                            </button>

                            {/* WhatsApp Owner Dispatch */}
                            {order.whatsappUrl && (
                              <a
                                href={order.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-[#0a1e14] hover:bg-[#132d20] border border-[#25D366]/40 text-[#25D366] font-cinzel text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Send to Debraj WhatsApp</span>
                              </a>
                            )}

                            {/* WhatsApp Customer */}
                            <a
                              href={`https://wa.me/91${order.customer.phone.replace(
                                /\D/g,
                                ''
                              )}?text=${encodeURIComponent(
                                `Namaste ${order.customer.name}, Mahira Select confirms your order #${order.id} for ₹${order.total.toLocaleString('en-IN')}. Settled directly to Debraj Dutta's Punjab National Bank account.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-cinzel text-[11px] font-bold rounded flex items-center gap-1.5 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Message Customer</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab: Configure Store WhatsApp, UPI, Bank Details */}
            {tab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="p-4 bg-[#0a1e14] border border-[#c5a880]/30 rounded-lg text-xs leading-relaxed text-[#e6ded0]">
                  <strong className="text-[#fae2b4] block text-sm font-serif-luxury mb-1">
                    Direct-to-Bank Gateway Configuration (Zero Third Party)
                  </strong>
                  All payments from dynamic Razorpay-style QR codes, UPI links, and card authorizations route directly into this Punjab National Bank account.
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded flex items-center gap-2 text-xs text-emerald-200">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Gateway settings updated and live!</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* WhatsApp Number */}
                  <div className="p-4 bg-[#06140e] border border-[#c5a880]/20 rounded-lg space-y-2">
                    <h4 className="font-cinzel text-xs font-bold text-[#fae2b4] uppercase tracking-wider flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Owner WhatsApp Dispatch Number</span>
                    </h4>
                    <p className="text-[11px] text-[#c5a880]">
                      All orders &amp; payment notifications are dispatched here automatically.
                    </p>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 8536943389"
                      className="w-full text-xs px-3 py-2 bg-[#0a1e14] border border-[#c5a880]/30 rounded text-[#f7f4ee] font-mono"
                    />
                  </div>

                  {/* UPI ID */}
                  <div className="p-4 bg-[#06140e] border border-[#c5a880]/20 rounded-lg space-y-2">
                    <h4 className="font-cinzel text-xs font-bold text-[#fae2b4] uppercase tracking-wider flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#fae2b4]" />
                      <span>Dynamic Payee UPI ID (VPA)</span>
                    </h4>
                    <p className="text-[11px] text-[#c5a880]">
                      The dynamic checkout QR encodes this UPI ID with the exact order total.
                    </p>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. theghost-debraj@yesfam"
                      className="w-full text-xs px-3 py-2 bg-[#0a1e14] border border-[#c5a880]/30 rounded text-[#f7f4ee] font-mono"
                    />
                  </div>

                  {/* Bank Account Details */}
                  <div className="p-4 bg-[#06140e] border border-[#c5a880]/20 rounded-lg space-y-3">
                    <h4 className="font-cinzel text-xs font-bold text-[#fae2b4] uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#fae2b4]" />
                      <span>Punjab National Bank Direct Settlement Account</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-[#c5a880] mb-1">
                          Account Beneficiary Name
                        </label>
                        <input
                          type="text"
                          value={accountHolder}
                          onChange={(e) => setAccountHolder(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-[#0a1e14] border border-[#c5a880]/30 rounded text-[#f7f4ee]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#c5a880] mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-[#0a1e14] border border-[#c5a880]/30 rounded text-[#f7f4ee] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#c5a880] mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={ifsc}
                          onChange={(e) => setIfsc(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-[#0a1e14] border border-[#c5a880]/30 rounded text-[#f7f4ee] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#c5a880] mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-[#0a1e14] border border-[#c5a880]/30 rounded text-[#f7f4ee]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs font-bold uppercase tracking-[0.2em] rounded-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Updating Gateway...' : 'Save & Deploy Gateway Settings'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#06140e] border-t border-[#c5a880]/20 flex items-center justify-between text-[11px] text-[#c5a880]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Bank Gateway • Punjab National Bank 2072001501047083</span>
            </span>
            <span className="font-mono text-[#fae2b4]">WhatsApp: +91 8536943389</span>
          </div>
        </div>
      </div>

      {/* UTR Bank Statement Audit Modal */}
      {auditingOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#071710] border border-amber-500/50 rounded-xl p-5 shadow-2xl space-y-4 text-xs text-[#f7f4ee]">
            <div className="flex items-center justify-between pb-3 border-b border-[#c5a880]/30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h4 className="font-serif-luxury text-base text-[#fae2b4]">
                  PNB Bank Passbook Audit Tool
                </h4>
              </div>
              <button
                onClick={() => setAuditingOrder(null)}
                className="p-1 text-[#c5a880] hover:text-[#fae2b4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order & Bank Summary */}
            <div className="p-3.5 bg-[#040e09] border border-[#c5a880]/30 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#c5a880] font-cinzel">Order Reference:</span>
                <span className="font-mono font-bold text-[#fae2b4]">#{auditingOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#c5a880] font-cinzel">Customer:</span>
                <span className="font-semibold">{auditingOrder.customer.name} ({auditingOrder.customer.phone})</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold border-t border-[#c5a880]/20 pt-1.5">
                <span className="text-[#c5a880] font-cinzel">Expected PNB Credit:</span>
                <span className="text-emerald-300">₹{auditingOrder.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#c5a880] font-cinzel">Submitted UTR:</span>
                <span className="font-mono font-bold text-amber-300 bg-[#132d20] px-2 py-0.5 rounded border border-amber-500/30">
                  {auditingOrder.utrReference || 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#c5a880]">
                <span>Settlement Bank:</span>
                <span>PNB A/C: 2072001501047083 (Debraj Dutta)</span>
              </div>
            </div>

            {/* Checklist instructions for Debraj */}
            <div className="p-3 bg-[#0a1e14] border border-amber-500/30 rounded text-[11px] text-[#e6ded0] space-y-1">
              <p className="font-bold text-[#fae2b4]">🔍 What if someone submitted another payment's UTR?</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[#c5a880]">
                <li>Check your Punjab National Bank SMS or mPassbook on your phone.</li>
                <li>Look for a credit of exactly <strong className="text-emerald-300">₹{auditingOrder.total.toLocaleString('en-IN')}</strong>.</li>
                <li>Verify if the transaction reference matches <strong className="text-amber-300 font-mono">{auditingOrder.utrReference}</strong>.</li>
                <li>If matching, click <strong>"Confirm PNB Credit"</strong> below.</li>
                <li>If uncredited or fake, click <strong>"Flag Fake / Uncredited UTR"</strong>.</li>
              </ul>
            </div>

            {/* Audit Notes Input */}
            <div>
              <label className="block text-[11px] text-[#c5a880] mb-1 font-cinzel">
                Audit Notes / PNB Statement Remarks:
              </label>
              <input
                type="text"
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                placeholder="e.g. Credited in PNB at 14:22, or Not found in PNB statement"
                className="w-full text-xs px-3 py-2 bg-[#040e09] border border-[#c5a880]/30 rounded text-[#f7f4ee]"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleReconcileUtr(auditingOrder.id, 'reconciled')}
                disabled={isAuditing}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-cinzel font-bold text-[11px] rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm PNB Credit</span>
              </button>

              <button
                onClick={() => handleReconcileUtr(auditingOrder.id, 'rejected_fraud')}
                disabled={isAuditing}
                className="py-2.5 px-3 bg-red-800 hover:bg-red-700 text-white font-cinzel font-bold text-[11px] rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Flag Fake / No Credit</span>
              </button>
            </div>

            {/* If Flagged as Fake: 1-Click WhatsApp Customer Warning */}
            {auditingOrder.utrReconciliationStatus === 'rejected_fraud' && (
              <div className="pt-2 border-t border-red-500/30">
                <a
                  href={`https://wa.me/91${auditingOrder.customer.phone.replace(
                    /\D/g,
                    ''
                  )}?text=${encodeURIComponent(
                    `Namaste ${auditingOrder.customer.name}, regarding order #${auditingOrder.id} on Mahira Select: We cross-checked the UTR ${auditingOrder.utrReference} with our Punjab National Bank account (A/C: 2072001501047083), but no credit of ₹${auditingOrder.total.toLocaleString('en-IN')} has arrived. Kindly share your bank payment screenshot or authentic transaction reference so we can process your order.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-cinzel text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Alert: "Payment Not Credited in PNB"</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tax Invoice Modal Preview */}
      <InvoiceModal
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />
    </>
  );
};
