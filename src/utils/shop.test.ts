import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice, calculateCartTotals, validateEmail, applyPromoCode } from './shop.ts';

test('formatPrice formats INR correctly', () => {
  assert.equal(formatPrice(12500, 'INR'), '₹12,500');
  assert.equal(formatPrice(0, 'INR'), '₹0');
});

test('formatPrice converts USD correctly', () => {
  const result = formatPrice(10000, 'USD');
  assert.equal(result, '$120');
});

test('calculateCartTotals calculates subtotals and free shipping eligibility', () => {
  const items = [
    {
      id: 'item-1',
      title: 'Embroidered Saree',
      subtitle: 'Silk organza',
      priceINR: 3500,
      image: '',
      quantity: 1,
    },
  ];

  const totalsBelow = calculateCartTotals(items, 0, 5000);
  assert.equal(totalsBelow.subtotalINR, 3500);
  assert.equal(totalsBelow.isFreeShipping, false);
  assert.equal(totalsBelow.shippingINR, 350);
  assert.equal(totalsBelow.totalINR, 3850);
  assert.equal(totalsBelow.amountNeededForFreeShippingINR, 1500);

  // Add another item to exceed threshold
  items.push({
    id: 'item-2',
    title: 'Kurta Set',
    subtitle: 'Chanderi',
    priceINR: 2000,
    image: '',
    quantity: 1,
  });

  const totalsAbove = calculateCartTotals(items, 10, 5000);
  assert.equal(totalsAbove.subtotalINR, 5500);
  assert.equal(totalsAbove.discountINR, 550);
  assert.equal(totalsAbove.isFreeShipping, true);
  assert.equal(totalsAbove.shippingINR, 0);
  assert.equal(totalsAbove.totalINR, 4950);
});

test('validateEmail validates email addresses correctly', () => {
  assert.equal(validateEmail('artisan@mahiraselect.com'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail(''), false);
  assert.equal(validateEmail('test@domain'), false);
});

test('applyPromoCode recognizes valid codes and discounts', () => {
  assert.deepEqual(applyPromoCode('WELCOME10'), {
    valid: true,
    discountPercent: 10,
    message: '10% Welcome gift applied!',
  });
  assert.deepEqual(applyPromoCode('mahira15'), {
    valid: true,
    discountPercent: 15,
    message: '15% Mahira heritage discount applied!',
  });
  assert.equal(applyPromoCode('FAKE123').valid, false);
});
