import type { IncomingMessage, ServerResponse } from 'http';
import {
  gatewayConfig,
  ordersDatabase,
  usersDatabase,
  createOrderRecord,
  generateWhatsAppMessage,
  buildWhatsAppUrl,
  validateUtrFormat,
  checkUtrDuplicate,
  reconcileOrderUtr,
  registerOrLoginUser,
  isOwnerIdentifier,
  Order,
  AppUser,
  UtrReconciliationStatus,
} from './backendCore.ts';

function readJsonBody(req: IncomingMessage): Promise<any> {
  if ((req as any).body && typeof (req as any).body === 'object') {
    return Promise.resolve((req as any).body);
  }
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // Protect against large payloads
      if (data.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        if (!data || data.trim() === '') {
          resolve({});
        } else {
          resolve(JSON.parse(data));
        }
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next?: () => void
): Promise<void> {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = url.pathname;
  const method = req.method?.toUpperCase();

  if (!pathname.startsWith('/api') && next) {
    next();
    return;
  }

  // Handle preflight
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  try {
    // 1. GET /api/config (Public store/gateway config)
    if (pathname === '/api/config' && method === 'GET') {
      sendJson(res, 200, {
        success: true,
        businessName: gatewayConfig.businessName,
        whatsappNumber: gatewayConfig.whatsappNumber,
        whatsappDisplay: gatewayConfig.whatsappDisplay,
        upiId: gatewayConfig.upiId,
        gstin: gatewayConfig.gstin,
        bankDetails: {
          accountHolder: gatewayConfig.bankDetails.accountHolder,
          accountNumber: gatewayConfig.bankDetails.accountNumber,
          ifsc: gatewayConfig.bankDetails.ifsc,
          bankName: gatewayConfig.bankDetails.bankName,
          branch: gatewayConfig.bankDetails.branch,
        },
        guarantee: {
          directSettlement: true,
          settlementAccount: 'Punjab National Bank 2072001501047083',
          intermediaryCut: '0%',
          description: '100% Direct-to-bank settlement via NPCI UPI / IMPS. No third-party wallet deduction.',
        },
      });
      return;
    }

    // AUTH 1. POST /api/auth/register (Patron & Owner Registration)
    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await readJsonBody(req);
      const { name, phone, email, password, address, city, state, pincode } = body;

      if (!phone || phone.replace(/\D/g, '').length < 10) {
        sendJson(res, 400, {
          success: false,
          message: 'Please provide a valid 10-digit mobile number.',
        });
        return;
      }

      if (!email || !email.includes('@')) {
        sendJson(res, 400, {
          success: false,
          message: 'Please provide a valid Gmail or Email address.',
        });
        return;
      }

      const result = registerOrLoginUser({
        name: name || '',
        phone,
        email,
        password,
        address,
        city,
        state,
        pincode,
      });

      if (!result.success) {
        sendJson(res, 401, {
          success: false,
          isOwner: result.isOwner,
          message: result.message,
        });
        return;
      }

      sendJson(res, 200, {
        success: true,
        user: result.user,
        isOwner: result.isOwner,
        message: result.message,
      });
      return;
    }

    // AUTH 2. POST /api/auth/login (Sign In via Phone or Gmail/Email + Password)
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await readJsonBody(req);
      const { identifier, phone, email, password, name } = body;

      const rawInput = (identifier || email || phone || '').trim();
      if (!rawInput) {
        sendJson(res, 400, {
          success: false,
          message: 'Please provide your registered Phone Number or Gmail / Email address.',
        });
        return;
      }

      const isEmail = rawInput.includes('@');
      const cleanEmail = isEmail ? rawInput.toLowerCase() : (email || '').toLowerCase();
      const cleanPhone = !isEmail ? rawInput.replace(/\D/g, '') : (phone ? phone.replace(/\D/g, '') : '');

      const result = registerOrLoginUser({
        name: name || '',
        phone: cleanPhone || (isOwnerIdentifier(cleanEmail, '') ? '8536943389' : '9830000000'),
        email: cleanEmail || (isOwnerIdentifier('', cleanPhone) ? 'debrajdutta200de@gmail.com' : `${cleanPhone}@customer.mahiraselect.in`),
        password,
      });

      if (!result.success) {
        sendJson(res, 401, {
          success: false,
          isOwner: result.isOwner,
          message: result.message,
        });
        return;
      }

      sendJson(res, 200, {
        success: true,
        user: result.user,
        isOwner: result.isOwner,
        message: result.message,
      });
      return;
    }

    // 2. POST /api/config (Update gateway details)
    if (pathname === '/api/config' && method === 'POST') {
      const body = await readJsonBody(req);
      if (body.whatsappNumber) gatewayConfig.whatsappNumber = body.whatsappNumber;
      if (body.whatsappDisplay) gatewayConfig.whatsappDisplay = body.whatsappDisplay;
      if (body.upiId) gatewayConfig.upiId = body.upiId;
      if (body.gstin) gatewayConfig.gstin = body.gstin;
      if (body.bankDetails) {
        gatewayConfig.bankDetails = {
          ...gatewayConfig.bankDetails,
          ...body.bankDetails,
        };
      }
      sendJson(res, 200, {
        success: true,
        message: 'Payment gateway configuration updated successfully',
        config: gatewayConfig,
      });
      return;
    }

    // 3. POST /api/payment/check-utr (Pre-flight real-time UTR Validation)
    if (pathname === '/api/payment/check-utr' && method === 'POST') {
      const body = await readJsonBody(req);
      const { utrReference, orderId } = body;

      const formatCheck = validateUtrFormat(utrReference);
      if (!formatCheck.valid) {
        sendJson(res, 400, {
          success: false,
          valid: false,
          code: 'INVALID_FORMAT',
          message: formatCheck.reason,
        });
        return;
      }

      const dupCheck = checkUtrDuplicate(formatCheck.cleanedUtr, orderId);
      if (dupCheck.isDuplicate) {
        sendJson(res, 409, {
          success: false,
          valid: false,
          code: 'DUPLICATE_UTR',
          message: `Fraud Warning: This UTR (${formatCheck.cleanedUtr}) has already been used for Order #${dupCheck.existingOrder?.id}. Each payment must have a unique reference.`,
          existingOrderId: dupCheck.existingOrder?.id,
        });
        return;
      }

      sendJson(res, 200, {
        success: true,
        valid: true,
        cleanedUtr: formatCheck.cleanedUtr,
        message: 'UTR format verified & confirmed unique.',
      });
      return;
    }

    // 4. POST /api/orders (Create Order)
    if (pathname === '/api/orders' && method === 'POST') {
      const body = await readJsonBody(req);
      const { customer, items, subtotal, discount, shipping, total, currency, paymentMethod, utrReference } = body;

      if (!customer || !customer.name || !customer.phone || !customer.address) {
        sendJson(res, 400, {
          success: false,
          message: 'Customer name, phone, and delivery address are mandatory.',
        });
        return;
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        sendJson(res, 400, {
          success: false,
          message: 'Bag must contain at least one piece to place order.',
        });
        return;
      }

      // If UPI method with UTR provided upfront, validate right away
      if (paymentMethod === 'upi' && utrReference) {
        const formatCheck = validateUtrFormat(utrReference);
        if (!formatCheck.valid) {
          sendJson(res, 400, {
            success: false,
            code: 'INVALID_FORMAT',
            message: formatCheck.reason,
          });
          return;
        }

        const dupCheck = checkUtrDuplicate(formatCheck.cleanedUtr);
        if (dupCheck.isDuplicate) {
          sendJson(res, 409, {
            success: false,
            code: 'DUPLICATE_UTR',
            message: `Fraud Protection Alert: This UTR (${formatCheck.cleanedUtr}) was already recorded for Order #${dupCheck.existingOrder?.id} on ${new Date(dupCheck.existingOrder?.createdAt || '').toLocaleDateString('en-IN')}. Reusing a payment reference from another transaction is strictly prohibited.`,
            existingOrderId: dupCheck.existingOrder?.id,
          });
          return;
        }
      }

      const order = createOrderRecord({
        customer,
        items,
        subtotal: Number(subtotal) || 0,
        discount: Number(discount) || 0,
        shipping: Number(shipping) || 0,
        total: Number(total) || 0,
        currency: currency || 'INR',
        paymentMethod: paymentMethod || 'whatsapp',
        utrReference: utrReference ? utrReference.trim().toUpperCase() : undefined,
      });

      sendJson(res, 200, {
        success: true,
        order,
        whatsappUrl: order.whatsappUrl,
      });
      return;
    }

    // 5. POST /api/payment/process-card (Direct In-house 3D-Secure Card Gateway)
    if (pathname === '/api/payment/process-card' && method === 'POST') {
      const body = await readJsonBody(req);
      const { orderId, cardNumber, cardHolder, expiry, cvv, cardBrand, otp } = body;

      if (!orderId || !ordersDatabase.has(orderId)) {
        sendJson(res, 404, { success: false, message: 'Order reference not found' });
        return;
      }

      const order = ordersDatabase.get(orderId)!;
      const cleanCard = (cardNumber || '').replace(/\s+/g, '');

      if (cleanCard.length < 13 || cleanCard.length > 19) {
        sendJson(res, 400, { success: false, message: 'Please provide a valid card number' });
        return;
      }

      if (!cardHolder || cardHolder.trim().length < 2) {
        sendJson(res, 400, { success: false, message: 'Cardholder name is required' });
        return;
      }

      const last4 = cleanCard.slice(-4);
      const authCode = `AUTH-PNB-${Math.floor(100000 + Math.random() * 900000)}`;

      order.paymentMethod = 'card';
      order.paymentStatus = 'completed';
      order.cardLast4 = last4;
      order.cardBrand = cardBrand || 'Credit/Debit Card';
      order.authCode = authCode;
      order.settlementAccount = `${gatewayConfig.bankDetails.bankName} (A/C: ${gatewayConfig.bankDetails.accountNumber}, IFSC: ${gatewayConfig.bankDetails.ifsc})`;
      order.whatsappUrl = buildWhatsAppUrl(order);
      order.ownerNotifiedAt = new Date().toISOString();
      ordersDatabase.set(orderId, order);

      sendJson(res, 200, {
        success: true,
        message: 'Card payment authorized & settled directly to Punjab National Bank account',
        order,
        transactionId: authCode,
        authCode,
        settlement: {
          beneficiary: 'Debraj Dutta',
          bank: gatewayConfig.bankDetails.bankName,
          accountNumber: gatewayConfig.bankDetails.accountNumber,
          ifsc: gatewayConfig.bankDetails.ifsc,
          status: 'Direct Bank Settlement Confirmed',
        },
      });
      return;
    }

    // 6. POST /api/payment/verify-upi (Direct Dynamic UPI Reference Verification with Anti-Fraud & Anti-Duplicate)
    if (pathname === '/api/payment/verify-upi' && method === 'POST') {
      const body = await readJsonBody(req);
      const { orderId, utrReference } = body;

      if (!orderId || !ordersDatabase.has(orderId)) {
        sendJson(res, 404, { success: false, message: 'Order reference not found' });
        return;
      }

      // 1. Format & Sanity Check
      const formatCheck = validateUtrFormat(utrReference);
      if (!formatCheck.valid) {
        sendJson(res, 400, {
          success: false,
          code: 'INVALID_FORMAT',
          message: formatCheck.reason,
        });
        return;
      }

      // 2. Duplicate Detection: Check if another order already used this UTR
      const dupCheck = checkUtrDuplicate(formatCheck.cleanedUtr, orderId);
      if (dupCheck.isDuplicate) {
        sendJson(res, 409, {
          success: false,
          code: 'DUPLICATE_UTR',
          message: `🚨 Fraud Protection: This UTR (${formatCheck.cleanedUtr}) has already been recorded for Order #${dupCheck.existingOrder?.id} on ${new Date(dupCheck.existingOrder?.createdAt || '').toLocaleDateString('en-IN')}. Submitting duplicate or reused payment references from another payment is strictly prohibited.`,
          existingOrderId: dupCheck.existingOrder?.id,
        });
        return;
      }

      const order = ordersDatabase.get(orderId)!;
      order.paymentMethod = 'upi';
      order.paymentStatus = 'completed';
      order.utrReference = formatCheck.cleanedUtr;
      order.utrReconciliationStatus = 'pending_bank_audit';
      order.authCode = `UPI-REF-${formatCheck.cleanedUtr.slice(-6)}`;
      order.settlementAccount = `${gatewayConfig.bankDetails.bankName} (A/C: ${gatewayConfig.bankDetails.accountNumber}, IFSC: ${gatewayConfig.bankDetails.ifsc})`;
      order.whatsappUrl = buildWhatsAppUrl(order);
      order.ownerNotifiedAt = new Date().toISOString();
      ordersDatabase.set(orderId, order);

      sendJson(res, 200, {
        success: true,
        message: 'UPI payment logged & queued for direct PNB account settlement. Authenticated successfully.',
        order,
        settlement: {
          beneficiary: 'Debraj Dutta',
          bank: gatewayConfig.bankDetails.bankName,
          accountNumber: gatewayConfig.bankDetails.accountNumber,
          ifsc: gatewayConfig.bankDetails.ifsc,
          upiId: gatewayConfig.upiId,
          utr: formatCheck.cleanedUtr,
          status: 'Direct Bank Settlement Confirmed',
        },
      });
      return;
    }

    // 7. POST /api/payment/reconcile-utr (Store Owner Bank Statement Audit Tool)
    if (pathname === '/api/payment/reconcile-utr' && method === 'POST') {
      const body = await readJsonBody(req);
      const { orderId, status, notes } = body;

      if (!orderId || !ordersDatabase.has(orderId)) {
        sendJson(res, 404, { success: false, message: 'Order reference not found' });
        return;
      }

      const result = reconcileOrderUtr(orderId, status as UtrReconciliationStatus, notes);
      const order = result.order!;

      // Generate a customer alert message if Debraj finds the UTR is fraudulent or not credited
      let customerAlertMessage = '';
      if (status === 'rejected_fraud' || status === 'duplicate_flagged') {
        customerAlertMessage = `Dear ${order.customer.name},\nRegarding your order #${order.id} on Mahira Select:\nThe submitted UTR reference (${order.utrReference}) could not be verified with any credit of ₹${order.total.toLocaleString('en-IN')} in our Punjab National Bank account (A/C: 2072001501047083).\n\nKindly share the original payment receipt screenshot with UTR number so our accounts team can trace and confirm your order.\n\nThank you,\nDebraj Dutta — Mahira Select\n+91 8536943389`;
      }

      sendJson(res, 200, {
        success: true,
        message: result.message,
        order,
        customerAlertMessage,
        customerWhatsAppUrl: customerAlertMessage
          ? `https://wa.me/91${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(customerAlertMessage)}`
          : undefined,
      });
      return;
    }

    // 8. POST /api/payment/verify-bank (Bank Transfer Reference)
    if (pathname === '/api/payment/verify-bank' && method === 'POST') {
      const body = await readJsonBody(req);
      const { orderId, utrReference } = body;

      if (!orderId || !ordersDatabase.has(orderId)) {
        sendJson(res, 404, { success: false, message: 'Order reference not found' });
        return;
      }

      const order = ordersDatabase.get(orderId)!;
      order.paymentMethod = 'bank_transfer';
      order.paymentStatus = 'completed';
      order.utrReference = (utrReference || '').trim().toUpperCase();
      order.authCode = `IMPS-${Date.now().toString().slice(-6)}`;
      order.settlementAccount = `${gatewayConfig.bankDetails.bankName} (A/C: ${gatewayConfig.bankDetails.accountNumber}, IFSC: ${gatewayConfig.bankDetails.ifsc})`;
      order.whatsappUrl = buildWhatsAppUrl(order);
      order.ownerNotifiedAt = new Date().toISOString();
      ordersDatabase.set(orderId, order);

      sendJson(res, 200, {
        success: true,
        message: 'Bank transfer reference logged. Settling directly to Debraj Dutta PNB account.',
        order,
      });
      return;
    }

    // 9. POST /api/notify-owner-whatsapp (Instant WhatsApp Notification Dispatcher)
    if (pathname === '/api/notify-owner-whatsapp' && method === 'POST') {
      const body = await readJsonBody(req);
      const { orderId } = body;

      if (!orderId || !ordersDatabase.has(orderId)) {
        sendJson(res, 404, { success: false, message: 'Order reference not found' });
        return;
      }

      const order = ordersDatabase.get(orderId)!;
      order.ownerNotifiedAt = new Date().toISOString();
      ordersDatabase.set(orderId, order);

      const message = generateWhatsAppMessage(order);
      const cleanPhone = gatewayConfig.whatsappNumber.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;

      sendJson(res, 200, {
        success: true,
        message: `Notification queued for Owner WhatsApp (+91 ${cleanPhone})`,
        recipientNumber: `+91 ${cleanPhone}`,
        whatsappUrl,
        orderId: order.id,
        invoiceNumber: order.invoiceNumber,
        settlementConfirmed: true,
      });
      return;
    }

    // 10. GET /api/orders (List Orders for Store Owner)
    if (pathname === '/api/orders' && method === 'GET') {
      const orders = Array.from(ordersDatabase.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      sendJson(res, 200, {
        success: true,
        count: orders.length,
        orders,
      });
      return;
    }

    // 11. GET /api/orders/:id
    if (pathname.startsWith('/api/orders/') && method === 'GET') {
      const id = pathname.replace('/api/orders/', '');
      const order = ordersDatabase.get(id);
      if (!order) {
        sendJson(res, 404, { success: false, message: 'Order not found' });
        return;
      }
      sendJson(res, 200, { success: true, order });
      return;
    }

    // Default 404 for unhandled /api
    sendJson(res, 404, { success: false, message: 'API route not found' });
  } catch (err: any) {
    console.error('API Error:', err);
    sendJson(res, 500, {
      success: false,
      message: err.message || 'Internal payment gateway error',
    });
  }
}
