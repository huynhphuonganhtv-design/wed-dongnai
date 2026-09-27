# HƯỚNG DẪN CẤU TRÚC & NÂNG CẤP DỰ ÁN - ĐẶC SẢN ĐỒNG NAI

Dự án đã được phân tách thành các module độc lập, chuyên biệt để bạn dễ dàng quản trị, chỉnh sửa và nâng cấp trong tương lai:

```
dac-san-dong-nai/
├── index.html            # Khung giao diện HTML chính
├── css/
│   └── style.css         # Toàn bộ CSS tùy biến, font chữ và hiệu ứng chuyển động
├── js/
│   ├── data.js           # Quản lý dữ liệu sản phẩm, thông tin tem QR và gói Combo
│   ├── cart.js           # Xử lý giỏ hàng, tính tổng tiền và gửi đơn hàng
│   ├── ai-advisor.js     # Thuật toán AI gợi ý combo quà biếu theo ngân sách
│   ├── chatbot.js        # Kịch bản tư vấn thông minh của AI Chatbot "Bé Ba"
│   ├── qr-modal.js       # Xử lý bật/tắt và hiển thị thông tin tra cứu mã QR
│   └── main.js           # Điểm khởi chạy (Entry point) và các hàm tiện ích chung
└── README.md             # Hướng dẫn chi tiết
```

---

## 🛠️ HƯỚNG DẪN NÂNG CẤP & CHỈNH SỬA:

### 1. Muốn thêm sản phẩm mới hoặc đổi giá:
👉 Mở file: **`js/data.js`**
- Chỉnh sửa mảng `PRODUCTS_DATA` (tên sản phẩm, giá, mô tả, độ ngọt Brix).

### 2. Muốn bổ sung thêm mã QR nhà vườn:
👉 Mở file: **`js/data.js`**
- Thêm đối tượng mới vào `TRACE_DATABASE` với mã ID, tên chủ vườn, tiêu chuẩn VietGAP và nhật ký thu hái.

### 3. Huấn luyện thêm kịch bản cho Chatbot AI "Bé Ba":
👉 Mở file: **`js/chatbot.js`**
- Trong hàm `getAiReply(userText)`: Thêm các từ khóa nhận diện mới (ví dụ: tư vấn xuất khẩu, chiết khấu sỉ, cách bảo quản mãng cầu...).

### 4. Thay đổi giao diện, màu sắc, font chữ:
👉 Mở file: **`css/style.css`** hoặc các class Tailwind trong **`index.html`**.

### 5. Kết nối API Zalo OA thực tế:
👉 Mở file: **`js/cart.js`**
- Trong hàm `handleOrderSubmit()`: Thay lệnh `alert()` bằng lệnh `fetch()` gửi dữ liệu đơn hàng về Webhook của Zalo OA hoặc Google Sheets / CRM của bạn.
