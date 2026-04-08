'use strict';

var assert = require('node:assert/strict');
var core = require('./core');

(function testServiceRevenue() {
  var revenue = core.calculateServiceRevenue([
    { price: 100000, quantity: 2 },
    { price: 50000, quantity: 1 }
  ]);
  assert.equal(revenue, 250000);
})();

(function testProductSaleAndSummary() {
  var products = [
    { id: 'p1', name: 'Cam', stock: 10, price: 50000 },
    { id: 'p2', name: 'Mật ong', stock: 4, price: 150000 }
  ];

  var next = core.applyProductSale(products, 'p1', 3);
  assert.equal(next[0].stock, 7);

  var summary = core.summarizeDashboard({
    products: next,
    bookings: [{ price: 120000, quantity: 2 }],
    orders: [{ unitPrice: 50000, quantity: 3 }]
  });

  assert.equal(summary.totalRevenue, 390000);
  assert.equal(summary.lowStockCount, 1);
})();

(function testInvalidStock() {
  assert.throws(function () {
    core.applyProductSale([{ id: 'p1', name: 'Cam', stock: 1, price: 1 }], 'p1', 3);
  }, /Tồn kho không đủ/);
})();

console.log('All farmstay core tests passed.');
