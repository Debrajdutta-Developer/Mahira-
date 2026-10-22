import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateWhatsAppMessage,
  buildWhatsAppUrl,
  buildUpiUri,
  createOrderRecord,
  validateUtrFormat,
  checkUtrDuplicate,
  reconcileOrderUtr,
  registerOrLoginUser,
  ordersDatabase,
} from './backendCore.ts';

test('createOrderRecord generates unique order and WhatsApp message', () => {
  const order = createOrderRecord({
    customer: {
      name: 'Debraj Dutta',
      email: 'debraj@example.com',
      phone: '8536943389',
      address: '12 Luxury Heritage Lane',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700001',
    },
    items: [
      {
        id: 'saree-01',
        title: 'Embroidered Zari Organza Saree',
        subtitle: 'Heritage collection',
        priceINR: 18500,
        quantity: 1,
        size: 'Standard Drape (6.3m)',
      },
    ],
    subtotal: 18500,
    discount: 0,
    shipping: 0,
    total: 18500,
    paymentMethod: 'whatsapp',
  });

  assert.ok(order.id.startsWith('MH-'));
  assert.equal(order.customer.phone, '8536943389');
  assert.equal(order.total, 18500);

  const msg = generateWhatsAppMessage(order);
  assert.ok(msg.includes('8536943389'));
  assert.ok(msg.includes('Embroidered Zari Organza Saree'));
  assert.ok(msg.includes('MAHIRA SELECT'));

  const waUrl = buildWhatsAppUrl(order);
  assert.ok(waUrl.includes('wa.me/918536943389'));
});

test('buildUpiUri builds valid upi URI format', () => {
  const order = createOrderRecord({
    customer: {
      name: 'Priyam Sharma',
      email: 'priyam@example.com',
      phone: '9876543210',
      address: 'Park Street',
      city: 'Kolkata',
      state: 'WB',
      pincode: '700016',
    },
    items: [
      {
        id: 'kurta-01',
        title: 'Chanderi Kurta Set',
        subtitle: 'Silk ensemble',
        priceINR: 14200,
        quantity: 1,
      },
    ],
    subtotal: 14200,
    discount: 1420,
    shipping: 0,
    total: 12780,
    paymentMethod: 'upi',
    utrReference: '428901234567',
  });

  const uri = buildUpiUri(order);
  assert.ok(uri.startsWith('upi://pay?'));
  assert.ok(uri.includes('theghost-debraj') || uri.includes('theghost-debraj%40yesfam'));
  assert.ok(uri.includes('am=12780.00'));
});

test('validateUtrFormat strictly validates real UPI UTR and catches fake/dummy numbers', () => {
  // Valid real 12-digit Indian UPI UTR
  const valid1 = validateUtrFormat('428901234567');
  assert.equal(valid1.valid, true);
  assert.equal(valid1.cleanedUtr, '428901234567');

  // Valid 16-character alphanumeric IMPS reference
  const valid2 = validateUtrFormat('PNBN240981726543');
  assert.equal(valid2.valid, true);

  // Short dummy UTR fails
  const shortUtr = validateUtrFormat('12345');
  assert.equal(shortUtr.valid, false);
  assert.ok(shortUtr.reason?.includes('too short'));

  // Repeating single character (fake) fails
  const repeating = validateUtrFormat('000000000000');
  assert.equal(repeating.valid, false);
  assert.ok(repeating.reason?.includes('Repeated pattern'));

  // Sequential dummy fails
  const sequential = validateUtrFormat('123456789012');
  assert.equal(sequential.valid, false);
  assert.ok(sequential.reason?.includes('Sequential'));

  // Placeholder keyword fails
  const dummyWord = validateUtrFormat('PAID_TODAY_OK');
  assert.equal(dummyWord.valid, false);
  assert.ok(dummyWord.reason?.includes('placeholder keyword'));
});

test('checkUtrDuplicate catches when someone enters another payment UTR already in system', () => {
  const originalOrder = createOrderRecord({
    customer: {
      name: 'First Buyer',
      email: 'buyer1@test.com',
      phone: '9876543210',
      address: 'Salt Lake',
      city: 'Kolkata',
      state: 'WB',
      pincode: '700091',
    },
    items: [
      { id: '1', title: 'Royal Lehenga', subtitle: '', priceINR: 50000, quantity: 1 },
    ],
    subtotal: 50000,
    discount: 0,
    shipping: 0,
    total: 50000,
    paymentMethod: 'upi',
    utrReference: '439871625341',
  });

  // Someone else attempts to submit the same UTR '439871625341' for a different order
  const dupCheck = checkUtrDuplicate('439871625341');
  assert.equal(dupCheck.isDuplicate, true);
  assert.equal(dupCheck.existingOrder?.id, originalOrder.id);

  // A brand new authentic UTR passes
  const newCheck = checkUtrDuplicate('499988877766');
  assert.equal(newCheck.isDuplicate, false);
});

test('reconcileOrderUtr updates reconciliation status and handles fraud rejection', () => {
  const order = createOrderRecord({
    customer: {
      name: 'Audit Test Customer',
      email: 'audit@test.com',
      phone: '9876543211',
      address: 'Ballygunge',
      city: 'Kolkata',
      state: 'WB',
      pincode: '700019',
    },
    items: [{ id: '1', title: 'Silk Saree', subtitle: '', priceINR: 20000, quantity: 1 }],
    subtotal: 20000,
    discount: 0,
    shipping: 0,
    total: 20000,
    paymentMethod: 'upi',
    utrReference: '501234987651',
  });

  // Owner audits against PNB statement and reconciles
  const resApproved = reconcileOrderUtr(order.id, 'reconciled', 'Credited in PNB A/C 2072001501047083 on 15 Oct');
  assert.equal(resApproved.success, true);
  assert.equal(ordersDatabase.get(order.id)?.utrReconciliationStatus, 'reconciled');
  assert.equal(ordersDatabase.get(order.id)?.paymentStatus, 'completed');

  // If another fake order was flagged
  const resFraud = reconcileOrderUtr(order.id, 'rejected_fraud', 'No credit found in PNB statement');
  assert.equal(resFraud.success, true);
  assert.equal(ordersDatabase.get(order.id)?.utrReconciliationStatus, 'rejected_fraud');
  assert.equal(ordersDatabase.get(order.id)?.paymentStatus, 'disputed');
});

test('registerOrLoginUser differentiates normal patrons from Store Owner (Debraj Dutta) with password debrajdutta0192837465', () => {
  // Test 1: Normal customer registration with phone and Gmail
  const patronResult = registerOrLoginUser({
    name: 'Tanima Mukherjee',
    phone: '9831002233',
    email: 'tanima.mukherjee@gmail.com',
    password: 'customerpassword123',
    city: 'Kolkata',
  });

  assert.equal(patronResult.success, true);
  assert.equal(patronResult.isOwner, false);
  assert.equal(patronResult.user?.role, 'customer');
  assert.equal(patronResult.user?.name, 'Tanima Mukherjee');

  // Test 2: Debraj Dutta login using his email and CORRECT owner password
  const ownerValidResult = registerOrLoginUser({
    email: 'debrajdutta200de@gmail.com',
    phone: '8536943389',
    password: 'debrajdutta0192837465',
  });

  assert.equal(ownerValidResult.success, true);
  assert.equal(ownerValidResult.isOwner, true);
  assert.equal(ownerValidResult.user?.role, 'owner');
  assert.equal(ownerValidResult.user?.phone, '8536943389');

  // Test 3: Debraj Dutta login using his phone number and WRONG password (must fail)
  const ownerWrongResult = registerOrLoginUser({
    phone: '8536943389',
    email: 'debrajdutta200de@gmail.com',
    password: 'wrong_password_999',
  });

  assert.equal(ownerWrongResult.success, false);
  assert.ok(ownerWrongResult.message.includes('Incorrect owner password'));
});

