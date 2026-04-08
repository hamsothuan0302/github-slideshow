---
layout: slide
title: "Farmstay Manager App"
---
# Farmstay Manager MVP (Đã có code demo)

Bạn có thể chạy thử bản demo tại:

`/App/farmstay-app/index.html`

---

## Các module đã triển khai

- Dashboard KPI doanh thu dịch vụ + nông sản.
- Tạo booking dịch vụ (lưu trú/tour/BBQ).
- Tạo đơn nông sản và tự động trừ tồn kho.
- Cảnh báo mặt hàng tồn thấp.
- Nhật ký giao dịch gần nhất.

---

## Kiến trúc code

- `App/farmstay-app/core.js`: nghiệp vụ tính doanh thu, trừ tồn, tổng hợp KPI.
- `App/farmstay-app/app.js`: xử lý UI + form + render dữ liệu.
- `App/farmstay-app/styles.css`: giao diện mobile-first.
- `App/farmstay-app/core.test.js`: test nghiệp vụ chạy bằng Node.js.

---

## Hướng mở rộng tiếp theo

- Đăng nhập phân quyền (chủ farm/nhân viên).
- Đồng bộ API backend (NestJS/Laravel).
- Thanh toán QR và xuất hoá đơn.
- Báo cáo theo ngày/tuần/tháng.
