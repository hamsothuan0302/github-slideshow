(function () {
  'use strict';

  var data = {
    services: [
      { id: 'svc-room', name: 'Lưu trú nhà gỗ', price: 950000 },
      { id: 'svc-tour', name: 'Tour thu hoạch nông sản', price: 250000 },
      { id: 'svc-bbq', name: 'Set BBQ tối', price: 450000 }
    ],
    products: [
      { id: 'prd-rau', name: 'Rau hữu cơ', stock: 40, price: 35000 },
      { id: 'prd-cam', name: 'Cam farm', stock: 25, price: 55000 },
      { id: 'prd-matong', name: 'Mật ong rừng', stock: 8, price: 180000 }
    ],
    bookings: [],
    orders: []
  };

  function currency(value) {
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
  }

  function renderSelect(id, items) {
    var select = document.getElementById(id);
    select.innerHTML = items
      .map(function (item) {
        return '<option value="' + item.id + '">' + item.name + '</option>';
      })
      .join('');
  }

  function getById(list, id) {
    return list.find(function (item) {
      return item.id === id;
    });
  }

  function renderDashboard() {
    var summary = FarmstayCore.summarizeDashboard(data);

    document.getElementById('kpi-total').textContent = currency(summary.totalRevenue);
    document.getElementById('kpi-service').textContent = currency(summary.serviceRevenue);
    document.getElementById('kpi-product').textContent = currency(summary.productRevenue);
    document.getElementById('kpi-bookings').textContent = String(summary.bookingsCount);
    document.getElementById('kpi-orders').textContent = String(summary.ordersCount);
    document.getElementById('kpi-low-stock').textContent = String(summary.lowStockCount);
  }

  function renderProducts() {
    var tbody = document.getElementById('products-table');
    tbody.innerHTML = data.products
      .map(function (product) {
        var lowClass = product.stock <= 5 ? 'low-stock' : '';
        return (
          '<tr>' +
          '<td>' + product.name + '</td>' +
          '<td>' + currency(product.price) + '</td>' +
          '<td class="' + lowClass + '">' + product.stock + '</td>' +
          '</tr>'
        );
      })
      .join('');
  }

  function renderActivity() {
    var wrapper = document.getElementById('activities');
    var combined = [];

    data.bookings.forEach(function (booking) {
      combined.push('🛎️ Dịch vụ: ' + booking.name + ' x' + booking.quantity + ' (' + booking.customer + ')');
    });

    data.orders.forEach(function (order) {
      combined.push('🥬 Nông sản: ' + order.name + ' x' + order.quantity + ' (' + order.customer + ')');
    });

    wrapper.innerHTML = combined.length
      ? combined.slice(-8).reverse().map(function (item) {
          return '<li>' + item + '</li>';
        }).join('')
      : '<li>Chưa có giao dịch nào.</li>';
  }

  function notify(message, isError) {
    var node = document.getElementById('status');
    node.textContent = message;
    node.className = isError ? 'status error' : 'status success';
  }

  function handleServiceForm() {
    var form = document.getElementById('service-form');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var serviceId = document.getElementById('service-select').value;
      var customer = document.getElementById('service-customer').value.trim() || 'Khách lẻ';
      var quantity = Number(document.getElementById('service-qty').value);
      var service = getById(data.services, serviceId);

      data.bookings.push({
        id: 'bkg-' + Date.now(),
        name: service.name,
        price: service.price,
        quantity: quantity,
        customer: customer
      });

      renderDashboard();
      renderActivity();
      notify('Đã tạo booking dịch vụ thành công.', false);
      form.reset();
      document.getElementById('service-qty').value = 1;
      renderSelect('service-select', data.services);
    });
  }

  function handleProductForm() {
    var form = document.getElementById('product-form');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var productId = document.getElementById('product-select').value;
      var customer = document.getElementById('product-customer').value.trim() || 'Khách lẻ';
      var quantity = Number(document.getElementById('product-qty').value);
      var product = getById(data.products, productId);

      try {
        data.products = FarmstayCore.applyProductSale(data.products, productId, quantity);

        data.orders.push({
          id: 'ord-' + Date.now(),
          name: product.name,
          unitPrice: product.price,
          quantity: quantity,
          customer: customer
        });

        renderProducts();
        renderDashboard();
        renderActivity();
        notify('Đã tạo đơn nông sản thành công.', false);
        form.reset();
        document.getElementById('product-qty').value = 1;
        renderSelect('product-select', data.products);
      } catch (error) {
        notify(error.message, true);
      }
    });
  }

  function init() {
    renderSelect('service-select', data.services);
    renderSelect('product-select', data.products);
    handleServiceForm();
    handleProductForm();
    renderProducts();
    renderDashboard();
    renderActivity();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
