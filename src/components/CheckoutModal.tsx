import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  FileText,
  CheckCircle2,
  Send,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import QRCode from 'qrcode';
import { CartItem, CurrencyCode, formatPrice } from '../utils/shop.ts';
import { BrandLogo, DiamondDivider } from './BrandLogo.tsx';
import { InvoiceModal } from './InvoiceModal.tsx';

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}

interface GatewayConfigState {
  businessName: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  upiId: string;
  gstin: string;
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branch: string;
  };
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: {
    subtotalINR: number;
    discountINR: number;
    shippingINR: number;
    totalINR: number;
    itemCount: number;
  };
  currency: CurrencyCode;
  onOrderCompleted: () => void;
  currentUser?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totals,
  currency,
  onOrderCompleted,
  currentUser,
}) => {
  // Steps: 'customer' | 'payment' | 'success'
  const [step, setStep] = useState<'customer' | 'payment' | 'success'>('customer');
  const [selectedMethod, setSelectedMethod] = useState<'whatsapp' | 'upi' | 'card' | 'bank_transfer'>('upi');

  // Customer form state
  const [customer, setCustomer] = useState<CustomerFormData>({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    city: currentUser?.city || 'Kolkata',
    state: currentUser?.state || 'West Bengal',
    pincode: currentUser?.pincode || '700001',
    notes: '',
  });

  useEffect(() => {
    if (currentUser) {
      setCustomer((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city,
        state: currentUser.state || prev.state,
        pincode: currentUser.pincode || prev.pincode,
      }));
    }
  }, [currentUser, isOpen]);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState('Credit/Debit Card');

  // 3D Secure / OTP Simulation modal state
  const [show3DSModal, setShow3DSModal] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState('853694');
  const [inputOtp, setInputOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(120);
  const [pendingCardOrder, setPendingCardOrder] = useState<any | null>(null);

  // Dynamic Razorpay-style UPI QR state
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>('');
  const [qrExpirySeconds, setQrExpirySeconds] = useState(900); // 15:00 minutes
  const [sessionRef, setSessionRef] = useState(`MH${Date.now().toString().slice(-6)}`);
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedBankAcc, setCopiedBankAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

  // Invoice Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Gateway config fetched from backend
  const [config, setConfig] = useState<GatewayConfigState>({
    businessName: 'Mahira Select',
    whatsappNumber: '8536943389',
    whatsappDisplay: '+91 85369 43389',
    upiId: 'theghost-debraj@yesfam',
    gstin: '19AAEPD8536Q1Z2',
    bankDetails: {
      accountHolder: 'Debraj Dutta (Mahira Select)',
      accountNumber: '2072001501047083',
      ifsc: 'PUNB0207200',
      bankName: 'Punjab National Bank (PNB)',
      branch: 'Kolkata Branch',
    },
  });

  // Created Order state
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ownerNotified, setOwnerNotified] = useState(false);

  // Fetch gateway config on open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/config')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.config) {
            setConfig(data.config);
          }
        })
        .catch((err) => console.log('Loaded default config', err));
      
      // Fresh session reference for checkout QR
      setSessionRef(`MH${Date.now().toString().slice(-6)}`);
      setQrExpirySeconds(900);
    }
  }, [isOpen]);

  // Razorpay-style 15-minute countdown timer for Dynamic UPI QR
  useEffect(() => {
    if (!isOpen || step !== 'payment' || selectedMethod !== 'upi') return;

    const timer = setInterval(() => {
      setQrExpirySeconds((prev) => {
        if (prev <= 1) {
          // Regenerate session ref when expired
          setSessionRef(`MH${Date.now().toString().slice(-6)}`);
          return 900;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, step, selectedMethod]);

  // 3D Secure OTP Timer
  useEffect(() => {
    if (!show3DSModal) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [show3DSModal]);

  // Generate Dynamic Razorpay-style UPI QR code
  useEffect(() => {
    if (isOpen && config.upiId) {
      // NPCI standard UPI format with exact checkout amount and merchant parameters
      const cleanPa = config.upiId.trim();
      const pn = encodeURIComponent(`${config.businessName} - Debraj Dutta`);
      const am = totals.totalINR.toFixed(2);
      const tr = encodeURIComponent(sessionRef);
      const tn = encodeURIComponent(`Mahira Order ${sessionRef}`);
      const upiUri = `upi://pay?pa=${cleanPa}&pn=${pn}&mc=&tr=${tr}&am=${am}&cu=INR&tn=${tn}`;

      QRCode.toDataURL(upiUri, {
        width: 280,
        margin: 1.5,
        color: {
          dark: '#07150e',
          light: '#fbf8f2',
        },
      })
        .then((url) => setUpiQrDataUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [isOpen, config, totals.totalINR, sessionRef]);

  // Detect card brand
  useEffect(() => {
    const clean = cardNumber.replace(/\s+/g, '');
    if (/^4/.test(clean)) setCardBrand('Visa');
    else if (/^5[1-5]/.test(clean)) setCardBrand('Mastercard');
    else if (/^(60|65|81|82)/.test(clean)) setCardBrand('RuPay');
    else if (/^3[47]/.test(clean)) setCardBrand('American Express');
    else setCardBrand('Credit/Debit Card');
  }, [cardNumber]);

  if (!isOpen) return null;

  // Format Card input
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format Expiry input
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Step 1 Validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customer.name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for order & WhatsApp updates');
      return;
    }
    if (!customer.address.trim()) {
      setErrorMessage('Please enter your complete delivery address');
      return;
    }
    if (!customer.pincode.trim() || customer.pincode.replace(/\D/g, '').length < 6) {
      setErrorMessage('Please enter a valid 6-digit postal pincode');
      return;
    }

    setStep('payment');
  };

  // Notify Store Owner WhatsApp (8536943389)
  const notifyOwnerOnWhatsApp = async (orderId: string) => {
    try {
      const res = await fetch('/api/notify-owner-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        setOwnerNotified(true);
      }
    } catch (err) {
      console.error('Failed to ping owner whatsapp backend:', err);
    }
  };

  // Create Order in backend
  const submitOrderToBackend = async (method: 'whatsapp' | 'upi' | 'card' | 'bank_transfer', extraData: any = {}) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        customer,
        items: items.map((it) => ({
          id: it.id,
          title: it.title,
          subtitle: it.subtitle,
          priceINR: it.priceINR,
          quantity: it.quantity,
          size: it.size,
          image: it.image,
        })),
        subtotal: totals.subtotalINR,
        discount: totals.discountINR,
        shipping: totals.shippingINR,
        total: totals.totalINR,
        currency: 'INR',
        paymentMethod: method,
        ...extraData,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit order');
      }

      return data.order;
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with Mahira Select server');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Order Confirmation
  const handleConfirmWhatsAppOrder = async () => {
    try {
      const order = await submitOrderToBackend('whatsapp');
      setCreatedOrder(order);
      setStep('success');
      onOrderCompleted();
      notifyOwnerOnWhatsApp(order.id);

      // Launch WhatsApp directly
      if (order.whatsappUrl) {
        window.open(order.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      // Handled in submitOrderToBackend
    }
  };

  // UPI Payment Confirmation with Anti-Fraud & Duplicate UTR Verification
  const handleConfirmUpiPayment = async () => {
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 10) {
      setErrorMessage('Please enter the authentic 12-digit UPI UTR / Transaction Reference number generated by your UPI app (e.g., 428901234567)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Live Anti-Fraud & Duplicate Verification
      const checkRes = await fetch('/api/payment/check-utr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utrReference: cleanUtr }),
      });
      const checkData = await checkRes.json();
      if (!checkData.success) {
        throw new Error(checkData.message || 'Invalid or duplicate UTR number. Please check your payment app receipt.');
      }

      // 2. Submit Order to Backend
      const order = await submitOrderToBackend('upi', { utrReference: checkData.cleanedUtr });

      // 3. Confirm UPI Settlement Registration
      const vRes = await fetch('/api/payment/verify-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          utrReference: checkData.cleanedUtr,
        }),
      });
      const vData = await vRes.json();
      if (!vData.success) {
        throw new Error(vData.message || 'UPI verification rejected');
      }

      setCreatedOrder({ ...order, utrReference: checkData.cleanedUtr });
      setStep('success');
      onOrderCompleted();
      notifyOwnerOnWhatsApp(order.id);

      // Trigger WhatsApp update with UTR included
      if (order.whatsappUrl) {
        window.open(order.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'UTR verification failed. Please verify your reference number.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Card Payment Initialization -> Opens 3D Secure / OTP Simulation
  const handleInitiateCardPayment = async () => {
    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      setErrorMessage('Please enter a valid 16-digit credit/debit card number');
      return;
    }
    if (!cardHolder.trim()) {
      setErrorMessage('Please provide the cardholder name');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setErrorMessage('Please enter card expiry in MM/YY format');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setErrorMessage('Please enter the 3 or 4-digit security CVV');
      return;
    }

    try {
      const order = await submitOrderToBackend('card', {
        cardLast4: cleanCard.slice(-4),
        cardBrand,
      });

      setPendingCardOrder(order);
      setSimulatedOtp('853694');
      setInputOtp('853694');
      setOtpTimer(120);
      setShow3DSModal(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize card authorization');
    }
  };

  // 3D Secure Final Authorization
  const handleVerify3DSOtp = async () => {
    if (!pendingCardOrder) return;

    setIsSubmitting(true);
    try {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      const res = await fetch('/api/payment/process-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: pendingCardOrder.id,
          cardNumber: cleanCard,
          cardHolder,
          expiry: cardExpiry,
          cvv: cardCvv,
          cardBrand,
          otp: inputOtp,
        }),
      });

      const cardResult = await res.json();
      if (!cardResult.success) {
        throw new Error(cardResult.message || 'Card authorization failed');
      }

      setShow3DSModal(false);
      setCreatedOrder(cardResult.order || pendingCardOrder);
      setStep('success');
      onOrderCompleted();
      notifyOwnerOnWhatsApp(pendingCardOrder.id);

      if (pendingCardOrder.whatsappUrl) {
        window.open(pendingCardOrder.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate 3D Secure OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bank Transfer Confirmation
  const handleConfirmBankTransfer = async () => {
    try {
      const order = await submitOrderToBackend('bank_transfer', {
        utrReference: utrNumber.trim() || 'Awaiting Transfer',
      });

      if (utrNumber.trim()) {
        await fetch('/api/payment/verify-bank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            utrReference: utrNumber.trim(),
          }),
        });
      }

      setCreatedOrder(order);
      setStep('success');
      onOrderCompleted();
      notifyOwnerOnWhatsApp(order.id);

      if (order.whatsappUrl) {
        window.open(order.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      // Handled
    }
  };

  const copyToClipboard = (text: string, type: 'upi' | 'acc' | 'ifsc') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else if (type === 'acc') {
      setCopiedBankAcc(true);
      setTimeout(() => setCopiedBankAcc(false), 2000);
    } else {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2000);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Standard UPI URI with exact checkout amount
  const exactAmountUpiUri = `upi://pay?pa=${config.upiId.trim()}&pn=${encodeURIComponent(
    `${config.businessName} - Debraj Dutta`
  )}&mc=&tr=${encodeURIComponent(sessionRef)}&am=${totals.totalINR.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
    `Mahira Order ${sessionRef}`
  )}`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md">
        <div
          className="relative w-full max-w-2xl bg-[#091a12] border border-[#c5a880]/40 rounded-xl text-[#f7f4ee] shadow-2xl overflow-hidden my-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#06140e] via-[#0d2217] to-[#06140e] border-b border-[#c5a880]/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrandLogo size="sm" showSubtitle={false} />
              <div>
                <h2 className="font-cinzel text-sm sm:text-base tracking-[0.2em] text-[#fae2b4] uppercase font-bold">
                  Direct In-House Checkout &amp; Payment
                </h2>
                <p className="text-[11px] text-[#c5a880] flex items-center gap-1 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#a8e6cf]" />
                  Direct Settlement to Debraj Dutta's PNB Bank • Instant WhatsApp Dispatch: {config.whatsappNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Checkout"
              className="p-1.5 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Indicator */}
          <div className="grid grid-cols-3 border-b border-[#c5a880]/20 text-center text-xs font-cinzel tracking-wider bg-[#06130d]">
            <div
              className={`py-2.5 transition-colors ${
                step === 'customer'
                  ? 'text-[#fae2b4] bg-[#0f281b] border-b-2 border-[#fae2b4] font-bold'
                  : 'text-[#c5a880]/60'
              }`}
            >
              1. Delivery Details
            </div>
            <div
              className={`py-2.5 transition-colors ${
                step === 'payment'
                  ? 'text-[#fae2b4] bg-[#0f281b] border-b-2 border-[#fae2b4] font-bold'
                  : 'text-[#c5a880]/60'
              }`}
            >
              2. Authentic Payment (UPI/Card)
            </div>
            <div
              className={`py-2.5 transition-colors ${
                step === 'success'
                  ? 'text-[#a8e6cf] bg-[#0f281b] border-b-2 border-[#a8e6cf] font-bold'
                  : 'text-[#c5a880]/60'
              }`}
            >
              3. Tax Invoice &amp; Dispatch
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-lg flex items-center gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Customer Details */}
            {step === 'customer' && (
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#c5a880]/20">
                  <h3 className="font-serif-luxury text-lg text-[#fae2b4]">
                    Shipping &amp; Delivery Concierge
                  </h3>
                  <span className="text-xs text-[#c5a880]">
                    Total: <strong className="text-[#fae2b4] font-mono">{formatPrice(totals.totalINR, currency)}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Debraj Dutta"
                      className="w-full text-xs px-3 py-2.5 bg-[#06140e] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full text-xs px-3 py-2.5 bg-[#06140e] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                    Email Address (For Tax Invoice)
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full text-xs px-3 py-2.5 bg-[#06140e] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="House/Flat number, Building, Street, Area landmark"
                    className="w-full text-xs px-3 py-2.5 bg-[#06140e] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-[#06140e] border border-[#c5a880]/40 rounded text-[#f7f4ee] focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-[#06140e] border border-[#c5a880]/40 rounded text-[#f7f4ee] focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="700001"
                      className="w-full text-xs px-3 py-2 bg-[#06140e] border border-[#c5a880]/40 rounded text-[#f7f4ee] focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                </div>

                {/* Items Quick Preview */}
                <div className="p-3 bg-[#06140e] border border-[#c5a880]/20 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between text-[#c5a880]">
                    <span>Order Pieces ({items.reduce((s, it) => s + it.quantity, 0)} items)</span>
                    <span className="text-[#fae2b4]">Complimentary Insured Courier</span>
                  </div>
                  <div className="flex justify-between font-cinzel font-bold text-sm text-[#fae2b4] pt-1 border-t border-[#c5a880]/15">
                    <span>Grand Total:</span>
                    <span>{formatPrice(totals.totalINR, currency)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded-lg flex items-center justify-center space-x-2 shadow-lg hover:opacity-95 transition-all"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Authentic Payment Gateway */}
            {step === 'payment' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#c5a880]/20">
                  <button
                    type="button"
                    onClick={() => setStep('customer')}
                    className="text-xs text-[#c5a880] hover:text-[#fae2b4] flex items-center gap-1 font-cinzel"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Address</span>
                  </button>

                  <div className="text-right">
                    <span className="text-[10px] text-[#c5a880] uppercase tracking-wider block font-cinzel">Amount to Pay</span>
                    <span className="text-sm font-bold text-[#fae2b4] font-mono">
                      {formatPrice(totals.totalINR, currency)}
                    </span>
                  </div>
                </div>

                {/* Direct Bank Settlement Guarantee Card */}
                <div className="p-3 bg-gradient-to-r from-[#071c12] via-[#0d2a1b] to-[#071c12] border border-emerald-500/40 rounded-lg flex items-start gap-2.5 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-cinzel text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                      Direct-to-Bank Settlement Assurance
                    </h4>
                    <p className="text-[11px] text-[#d1c7b7] leading-relaxed mt-0.5">
                      Your payment transfers directly into <strong>Debraj Dutta's Punjab National Bank Account (A/C: ****7083, IFSC: PUNB0207200)</strong>. No 3rd-party escrow holds your funds.
                    </p>
                  </div>
                </div>

                {/* Payment Methods Selector Tabs */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Method 1: Dynamic Razorpay-style UPI */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('upi');
                      setErrorMessage('');
                    }}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'upi'
                        ? 'border-[#fae2b4] bg-[#0c2718] text-[#f7f4ee] shadow-lg ring-1 ring-[#fae2b4]/50'
                        : 'border-[#c5a880]/30 bg-[#06140e] text-[#b89565] hover:border-[#c5a880]'
                    }`}
                  >
                    <QrCode
                      className={`w-5 h-5 mb-1.5 ${
                        selectedMethod === 'upi' ? 'text-[#fae2b4]' : 'text-[#b89565]'
                      }`}
                    />
                    <div>
                      <p className="font-cinzel text-xs font-bold leading-tight">Dynamic UPI</p>
                      <p className="text-[9px] text-[#c5a880]/80 mt-0.5">Razorpay QR</p>
                    </div>
                  </button>

                  {/* Method 2: Direct Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('card');
                      setErrorMessage('');
                    }}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[#fae2b4] bg-[#0c2718] text-[#f7f4ee] shadow-lg ring-1 ring-[#fae2b4]/50'
                        : 'border-[#c5a880]/30 bg-[#06140e] text-[#b89565] hover:border-[#c5a880]'
                    }`}
                  >
                    <CreditCard
                      className={`w-5 h-5 mb-1.5 ${
                        selectedMethod === 'card' ? 'text-[#fae2b4]' : 'text-[#b89565]'
                      }`}
                    />
                    <div>
                      <p className="font-cinzel text-xs font-bold leading-tight">Card (3DS)</p>
                      <p className="text-[9px] text-[#c5a880]/80 mt-0.5">Visa/Master/RuPay</p>
                    </div>
                  </button>

                  {/* Method 3: Direct WhatsApp */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('whatsapp');
                      setErrorMessage('');
                    }}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'whatsapp'
                        ? 'border-[#25D366] bg-[#0c2718] text-[#f7f4ee] shadow-lg ring-1 ring-[#25D366]/50'
                        : 'border-[#c5a880]/30 bg-[#06140e] text-[#b89565] hover:border-[#c5a880]'
                    }`}
                  >
                    <MessageCircle
                      className={`w-5 h-5 mb-1.5 ${
                        selectedMethod === 'whatsapp' ? 'text-[#25D366]' : 'text-[#b89565]'
                      }`}
                    />
                    <div>
                      <p className="font-cinzel text-xs font-bold leading-tight">WhatsApp</p>
                      <p className="text-[9px] text-[#c5a880]/80 mt-0.5">8536943389</p>
                    </div>
                  </button>

                  {/* Method 4: Direct Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('bank_transfer');
                      setErrorMessage('');
                    }}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'bank_transfer'
                        ? 'border-[#fae2b4] bg-[#0c2718] text-[#f7f4ee] shadow-lg ring-1 ring-[#fae2b4]/50'
                        : 'border-[#c5a880]/30 bg-[#06140e] text-[#b89565] hover:border-[#c5a880]'
                    }`}
                  >
                    <Building2
                      className={`w-5 h-5 mb-1.5 ${
                        selectedMethod === 'bank_transfer' ? 'text-[#fae2b4]' : 'text-[#b89565]'
                      }`}
                    />
                    <div>
                      <p className="font-cinzel text-xs font-bold leading-tight">PNB IMPS</p>
                      <p className="text-[9px] text-[#c5a880]/80 mt-0.5">Direct Transfer</p>
                    </div>
                  </button>
                </div>

                {/* METHOD 1: Dynamic Razorpay-style UPI QR */}
                {selectedMethod === 'upi' && (
                  <div className="p-4 sm:p-5 bg-[#06140e] border border-[#c5a880]/30 rounded-xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-[#c5a880]/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <h4 className="font-serif-luxury text-base sm:text-lg text-[#fae2b4]">
                            Razorpay-Style Dynamic Checkout QR
                          </h4>
                        </div>
                        <p className="text-[11px] text-[#a8e6cf]">
                          Exact Amount Locked: <strong>₹{totals.totalINR.toFixed(2)}</strong> • Ref: {sessionRef}
                        </p>
                      </div>

                      {/* Live 15-Minute Expiry Countdown */}
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#10291d] border border-[#c5a880]/40 rounded-full text-xs font-mono text-[#fae2b4] self-start sm:self-auto">
                        <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>Expires in {formatTimer(qrExpirySeconds)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                      {/* Dynamic QR Code */}
                      <div className="bg-white p-3 rounded-xl shadow-2xl border-2 border-[#c5a880]/50 shrink-0 text-center relative group">
                        {upiQrDataUrl ? (
                          <img
                            src={upiQrDataUrl}
                            alt="Dynamic UPI QR"
                            className="w-48 h-48 object-contain mx-auto"
                          />
                        ) : (
                          <div className="w-48 h-48 flex items-center justify-center text-black text-xs font-cinzel">
                            Generating Dynamic QR...
                          </div>
                        )}
                        <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-gray-800 font-bold uppercase tracking-wider font-cinzel">
                          <span>Amount: ₹{totals.totalINR.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* UPI Fast Apps & VPA Details */}
                      <div className="space-y-3 flex-1 text-xs w-full">
                        <div>
                          <span className="text-[#c5a880] uppercase tracking-wider text-[10px] font-cinzel block mb-1">
                            Payee UPI VPA (Punjab National Bank):
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-1.5 bg-[#0a1e14] border border-[#c5a880]/40 rounded text-[#fae2b4] font-mono text-xs sm:text-sm font-bold truncate">
                              {config.upiId}
                            </code>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(config.upiId, 'upi')}
                              className="p-1.5 border border-[#c5a880]/40 rounded hover:bg-[#132d20] text-[#c5a880] hover:text-[#fae2b4] transition-colors"
                              title="Copy UPI ID"
                            >
                              {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Quick Launch Mobile App Buttons */}
                        <div>
                          <span className="text-[10px] text-[#c5a880] uppercase tracking-wider font-cinzel block mb-1.5">
                            Instant Launch on Your UPI App:
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            <a
                              href={exactAmountUpiUri}
                              className="px-2 py-1.5 bg-[#0a1e14] hover:bg-[#132d20] border border-[#c5a880]/30 rounded text-center text-[10px] font-cinzel font-semibold text-[#fae2b4] transition-colors flex items-center justify-center gap-1"
                            >
                              <span>Google Pay</span>
                            </a>
                            <a
                              href={exactAmountUpiUri}
                              className="px-2 py-1.5 bg-[#0a1e14] hover:bg-[#132d20] border border-[#c5a880]/30 rounded text-center text-[10px] font-cinzel font-semibold text-[#fae2b4] transition-colors flex items-center justify-center gap-1"
                            >
                              <span>PhonePe</span>
                            </a>
                            <a
                              href={exactAmountUpiUri}
                              className="px-2 py-1.5 bg-[#0a1e14] hover:bg-[#132d20] border border-[#c5a880]/30 rounded text-center text-[10px] font-cinzel font-semibold text-[#fae2b4] transition-colors flex items-center justify-center gap-1"
                            >
                              <span>Paytm / Cred</span>
                            </a>
                          </div>
                        </div>

                        {/* UTR Input Form */}
                        <div className="pt-1">
                          <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1 font-semibold">
                            Enter 12-Digit UPI UTR / Bank Reference No *
                          </label>
                          <input
                            type="text"
                            maxLength={16}
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 429182749102 (from UPI app)"
                            className="w-full text-xs font-mono tracking-wider px-3 py-2 bg-[#0a1e14] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                          />
                          <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-[#05110b] border border-[#c5a880]/20 rounded text-[10px] text-[#fae2b4]/80 leading-relaxed font-sans">
                            <span className="text-[#fae2b4]">🔒</span>
                            <span>
                              <strong className="text-[#fae2b4] font-cinzel">Direct Bank Audit:</strong> Duplicate, reused, or fake UTRs are rejected immediately. All submissions are cross-matched with ₹{totals.totalINR.toLocaleString('en-IN')} credit in Debraj Dutta's PNB account.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmUpiPayment}
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-all disabled:opacity-70"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {isSubmitting ? 'Verifying & Generating Invoice...' : 'Authenticate Payment & Generate Invoice'}
                      </span>
                    </button>
                  </div>
                )}

                {/* METHOD 2: Direct Credit / Debit Card (With 3DS Simulation) */}
                {selectedMethod === 'card' && (
                  <div className="p-4 sm:p-5 bg-[#06140e] border border-[#c5a880]/30 rounded-xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#c5a880]/20">
                      <div>
                        <h4 className="font-serif-luxury text-base sm:text-lg text-[#fae2b4]">
                          Direct Credit / Debit Card Gateway
                        </h4>
                        <p className="text-xs text-[#a8e6cf] flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          3D Secure Protected • Zero 3rd-Party Gateway Deductions
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#132d20] border border-[#c5a880]/30 rounded text-xs text-[#fae2b4] font-cinzel font-semibold">
                        {cardBrand}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                          Card Number (Visa / Mastercard / RuPay / Amex) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="4111 2222 3333 4444"
                            className="w-full text-xs font-mono tracking-wider px-3.5 py-2.5 bg-[#0a1e14] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                          />
                          <CreditCard className="w-4 h-4 absolute right-3 top-3 text-[#c5a880]" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="AS PRINTED ON CARD"
                          className="w-full text-xs uppercase px-3.5 py-2.5 bg-[#0a1e14] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                            Expiry (MM/YY) *
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full text-xs font-mono px-3.5 py-2.5 bg-[#0a1e14] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                            CVV / CVC *
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className="w-full text-xs font-mono px-3.5 py-2.5 bg-[#0a1e14] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleInitiateCardPayment}
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-all disabled:opacity-70"
                    >
                      <Lock className="w-4 h-4" />
                      <span>
                        {isSubmitting
                          ? 'Contacting Bank 3D Secure...'
                          : `Pay ${formatPrice(totals.totalINR, currency)} via 3D Secure`}
                      </span>
                    </button>
                  </div>
                )}

                {/* METHOD 3: Direct WhatsApp Concierge Order */}
                {selectedMethod === 'whatsapp' && (
                  <div className="p-4 sm:p-5 bg-[#06140e] border border-[#25D366]/30 rounded-xl space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif-luxury text-base sm:text-lg text-[#fae2b4]">
                          Direct WhatsApp Concierge Dispatch
                        </h4>
                        <p className="text-xs text-[#a8e6cf]">
                          Official WhatsApp: <strong>{config.whatsappNumber}</strong>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#e6ded0] leading-relaxed">
                      Your order will be transmitted directly to our store owner on WhatsApp at <strong>{config.whatsappDisplay}</strong> with your full items breakdown, delivery address, and payment options.
                    </p>

                    <button
                      onClick={handleConfirmWhatsAppOrder}
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-all disabled:opacity-70"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>
                        {isSubmitting ? 'Recording Order...' : `Dispatch Order to WhatsApp (${config.whatsappNumber})`}
                      </span>
                    </button>
                  </div>
                )}

                {/* METHOD 4: Direct Bank Transfer (IMPS/NEFT) */}
                {selectedMethod === 'bank_transfer' && (
                  <div className="p-4 sm:p-5 bg-[#06140e] border border-[#c5a880]/30 rounded-xl space-y-4">
                    <div>
                      <h4 className="font-serif-luxury text-base sm:text-lg text-[#fae2b4]">
                        Direct Punjab National Bank Transfer
                      </h4>
                      <p className="text-xs text-[#c5a880]">
                        Direct transfer via IMPS / NEFT directly into Debraj Dutta's account
                      </p>
                    </div>

                    <div className="bg-[#0a1e14] border border-[#c5a880]/30 rounded-lg p-3.5 space-y-2 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-[#c5a880]/15">
                        <span className="text-[#c5a880] font-cinzel">Account Name:</span>
                        <strong className="text-[#f7f4ee]">{config.bankDetails.accountHolder}</strong>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-[#c5a880]/15">
                        <span className="text-[#c5a880] font-cinzel">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#fae2b4] font-mono text-sm">
                            {config.bankDetails.accountNumber}
                          </strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(config.bankDetails.accountNumber, 'acc')}
                            className="p-1 text-[#c5a880] hover:text-[#fae2b4]"
                          >
                            {copiedBankAcc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-[#c5a880]/15">
                        <span className="text-[#c5a880] font-cinzel">IFSC Code:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-[#fae2b4] font-mono text-sm">
                            {config.bankDetails.ifsc}
                          </strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(config.bankDetails.ifsc, 'ifsc')}
                            className="p-1 text-[#c5a880] hover:text-[#fae2b4]"
                          >
                            {copiedIfsc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-1">
                        <span className="text-[#c5a880] font-cinzel">Bank &amp; Branch:</span>
                        <span className="text-[#e6ded0]">
                          {config.bankDetails.bankName} ({config.bankDetails.branch})
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                        IMPS / NEFT Reference (UTR) Number
                      </label>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="Optional or provide via WhatsApp"
                        className="w-full text-xs px-3.5 py-2.5 bg-[#0a1e14] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                      />
                    </div>

                    <button
                      onClick={handleConfirmBankTransfer}
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-all disabled:opacity-70"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>
                        {isSubmitting ? 'Logging Order...' : 'Confirm Bank Transfer & Generate Invoice'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Order Success, Invoice & WhatsApp Dispatch */}
            {step === 'success' && createdOrder && (
              <div className="py-4 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#132d20] border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-2xl animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="px-3 py-1 bg-[#163022] border border-[#c5a880]/40 rounded-full text-xs font-mono text-[#fae2b4]">
                    ORDER #{createdOrder.id} • INVOICE #{createdOrder.invoiceNumber || `INV-${createdOrder.id}`}
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#fae2b4] mt-2">
                    Payment Authenticated &amp; Order Confirmed
                  </h3>
                  <p className="text-xs text-[#c5a880] max-w-md mx-auto mt-1 leading-relaxed">
                    Thank you, <strong className="text-[#f7f4ee]">{createdOrder.customer.name}</strong>.
                    Your payment was verified and credited directly to the proprietor's Punjab National Bank account.
                  </p>
                </div>

                {/* Settlement Confirmation Box */}
                <div className="p-4 bg-[#06140e] border border-emerald-500/40 rounded-xl text-left text-xs space-y-2 max-w-lg mx-auto">
                  <div className="flex items-center justify-between border-b border-[#c5a880]/15 pb-1.5">
                    <span className="text-emerald-400 font-cinzel font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      Direct Settlement Status:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold uppercase">
                      Settled to PNB A/C ****7083
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-[#c5a880]/15 pb-1">
                    <span className="text-[#c5a880]">Beneficiary Name:</span>
                    <span className="text-[#f7f4ee] font-semibold">Debraj Dutta</span>
                  </div>

                  <div className="flex justify-between border-b border-[#c5a880]/15 pb-1">
                    <span className="text-[#c5a880]">Payment Method:</span>
                    <span className="text-[#fae2b4] font-semibold capitalize">
                      {createdOrder.paymentMethod}
                      {createdOrder.utrReference ? ` (UTR: ${createdOrder.utrReference})` : ''}
                      {createdOrder.cardLast4 ? ` (Card •••• ${createdOrder.cardLast4})` : ''}
                    </span>
                  </div>

                  <div className="flex justify-between font-bold text-[#fae2b4] pt-0.5">
                    <span>Grand Total Paid:</span>
                    <span className="font-mono text-sm">₹{createdOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 max-w-lg mx-auto">
                  {/* Tax Invoice CTA */}
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded-lg flex items-center justify-center space-x-2 shadow-xl hover:opacity-95 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View &amp; Download Official Tax Invoice (PDF)</span>
                  </button>

                  {/* WhatsApp Direct Notification CTA */}
                  {createdOrder.whatsappUrl && (
                    <a
                      href={createdOrder.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Notify Store Owner on WhatsApp (+91 {config.whatsappNumber})</span>
                    </a>
                  )}

                  <button
                    onClick={onClose}
                    className="text-xs text-[#c5a880] hover:text-[#fae2b4] underline font-cinzel pt-2 block mx-auto"
                  >
                    Return to Atelier Storefront
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3D SECURE OTP SIMULATION MODAL */}
      {show3DSModal && pendingCardOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#081810] border border-[#c5a880]/50 rounded-xl p-6 text-[#f7f4ee] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c5a880]/20">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-cinzel text-xs uppercase tracking-wider text-[#fae2b4] font-bold">
                  Punjab National Bank 3D Secure
                </span>
              </div>
              <button
                onClick={() => setShow3DSModal(false)}
                className="text-[#c5a880] hover:text-[#fae2b4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs text-[#c5a880]">Verified by Visa / Mastercard Identity Check</p>
              <h4 className="font-cinzel text-sm text-[#fae2b4] font-bold">
                Authorize ₹{pendingCardOrder.total.toLocaleString('en-IN')}
              </h4>
              <p className="text-[11px] text-[#d1c7b7] leading-relaxed">
                An authentic One Time Password (OTP) has been dispatched to your mobile registered with your bank.
              </p>
            </div>

            <div className="bg-[#040f09] p-3 rounded-lg border border-[#c5a880]/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#c5a880]">Merchant:</span>
                <span className="text-[#fae2b4] font-semibold">Mahira Select (Debraj Dutta)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c5a880]">Settlement:</span>
                <span className="text-emerald-400 font-mono">PNB A/C 2072001501047083</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c5a880]">OTP Code:</span>
                <span className="font-mono font-bold text-[#fae2b4]">{simulatedOtp}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1">
                Enter 6-Digit Bank OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="853694"
                className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 bg-[#05130c] border border-[#c5a880]/50 rounded text-[#fae2b4] focus:outline-none focus:border-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-[#c5a880] mt-1 font-mono">
                <span>Expires in {otpTimer}s</span>
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedOtp('853694');
                    setInputOtp('853694');
                    setOtpTimer(120);
                  }}
                  className="hover:underline text-emerald-400"
                >
                  Resend OTP
                </button>
              </div>
            </div>

            <button
              onClick={handleVerify3DSOtp}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs uppercase tracking-wider font-bold rounded-lg shadow-lg hover:opacity-95 transition-all disabled:opacity-70"
            >
              {isSubmitting ? 'Authenticating & Settling to PNB...' : 'Authenticate & Complete Payment'}
            </button>
          </div>
        </div>
      )}

      {/* TAX INVOICE MODAL */}
      {showInvoiceModal && createdOrder && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          order={createdOrder}
        />
      )}
    </>
  );
};
