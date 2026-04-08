(function (global) {
  'use strict';

  function calculateServiceRevenue(bookings) {
    return bookings.reduce(function (sum, item) {
      return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);
  }

  function calculateProductRevenue(orders) {
    return orders.reduce(function (sum, item) {
      return sum + (item.unitPrice || 0) * (item.quantity || 0);
    }, 0);
  }

  function applyProductSale(products, productId, quantity) {
    var nextProducts = products.map(function (product) {
      return { id: product.id, name: product.name, stock: product.stock, price: product.price };
    });

    var target = nextProducts.find(function (product) {
      return product.id === productId;
    });

    if (!target) {
      throw new Error('Không tìm thấy nông sản.');
    }

    if (quantity <= 0) {
      throw new Error('Số lượng bán phải lớn hơn 0.');
    }

    if (target.stock < quantity) {
      throw new Error('Tồn kho không đủ để bán.');
    }

    target.stock -= quantity;

    return nextProducts;
  }

  function summarizeDashboard(state) {
    var serviceRevenue = calculateServiceRevenue(state.bookings);
    var productRevenue = calculateProductRevenue(state.orders);
    var lowStockCount = state.products.filter(function (product) {
      return product.stock <= 5;
    }).length;

    return {
      serviceRevenue: serviceRevenue,
      productRevenue: productRevenue,
      totalRevenue: serviceRevenue + productRevenue,
      bookingsCount: state.bookings.length,
      ordersCount: state.orders.length,
      lowStockCount: lowStockCount
    };
  }

  var api = {
    calculateServiceRevenue: calculateServiceRevenue,
    calculateProductRevenue: calculateProductRevenue,
    applyProductSale: applyProductSale,
    summarizeDashboard: summarizeDashboard
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.FarmstayCore = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
