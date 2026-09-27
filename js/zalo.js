/**
 * MODULE KẾT NỐI ZALO (ZALO INTEGRATION) - ĐẶC SẢN ĐỒNG NAI
 * Quản lý:
 * 1. Số điện thoại Zalo nhận đơn của Chủ cơ sở / HTX.
 * 2. Tự động soạn tin nhắn chi tiết đơn hàng gửi thẳng qua Zalo.
 * 3. Nút nổi Chat Zalo (Floating Zalo Button) rung lắc thu hút khách hàng.
 * 4. Hỗ trợ thay đổi số Zalo trực tiếp ngay trên giao diện.
 */

// Số điện thoại Zalo mặc định của HTX (Bạn có thể đổi số của mình tại đây hoặc bấm nút Cài đặt)
let HTX_ZALO_PHONE = localStorage.getItem('htx_zalo_phone') || '0988888888';

// Hàm mở chat Zalo với chủ cơ sở
function openZaloChat(customMessage = '') {
  const phone = HTX_ZALO_PHONE.replace(/[^0-9]/g, '');
  const url = `https://zalo.me/${phone}`;
  
  if (customMessage) {
    // Copy nội dung đơn hàng vào clipboard để khách sang Zalo chỉ cần bấm Dán (Ctrl + V)
    navigator.clipboard.writeText(customMessage).then(() => {
      showToast('Đã sao chép nội dung đơn! Đang mở Zalo...');
    }).catch(() => {});
  }
  
  window.open(url, '_blank');
}

// Hàm đổi số điện thoại Zalo nhận đơn
function configureZaloPhone() {
  const current = localStorage.getItem('htx_zalo_phone') || HTX_ZALO_PHONE;
  const newPhone = prompt('0988863234:', current);
  
  if (newPhone && newPhone.trim()) {
    HTX_ZALO_PHONE = newPhone.trim();
    localStorage.setItem('htx_zalo_phone', HTX_ZALO_PHONE);
    alert(`✅ Đã lưu số Zalo nhận đơn: ${HTX_ZALO_PHONE}\nTừ bây giờ khách đặt hàng sẽ gửi tin nhắn trực tiếp tới số này của bạn!`);
    updateZaloUI();
  }
}

// Cập nhật số Zalo hiển thị trên giao diện
function updateZaloUI() {
  const phoneEls = document.querySelectorAll('.htx-zalo-number');
  phoneEls.forEach(el => {
    el.innerText = HTX_ZALO_PHONE;
  });
}

// Soạn nội dung tin nhắn gửi Zalo chuyên nghiệp
function createZaloOrderMessage(order) {
  const itemsText = order.items.map(i => `  • ${i.name} x ${i.quantity} = ${(i.price * i.quantity).toLocaleString('vi-VN')}đ`).join('\n');
  
  return `Chào Hợp Tác Xã Nông Sản Đặc Sản Đồng Nai! 🍊\n` +
    `Tôi vừa đặt đơn hàng trên website, gửi bạn thông tin đơn:\n` +
    `--------------------------------\n` +
    `📦 MÃ ĐƠN HÀNG: ${order.id}\n` +
    `⏰ Thời gian: ${order.date}\n` +
    `🛒 DANH SÁCH ĐẶC SẢN:\n${itemsText}\n` +
    `💰 TỔNG THANH TOÁN: ${order.total}\n` +
    `💳 Hình thức: ${order.paymentMethod}\n` +
    `--------------------------------\n` +
    `👤 Người nhận: ${order.recipient}\n` +
    `📞 Số điện thoại: ${order.phone}\n` +
    `📍 Địa chỉ giao hàng: ${order.address}\n` +
    (order.notes ? `📝 Ghi chú: ${order.notes}\n` : '') +
    `--------------------------------\n` +
    `Nhờ HTX kiểm tra đơn và gửi ảnh bưởi/hạt điều thực tế tại vườn qua Zalo giúp tôi nhé!`;
}

// Modal thông báo thành công & nút gửi Zalo 1 chạm
function showZaloSuccessModal(order) {
  let modal = document.getElementById('zaloSuccessModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'zaloSuccessModal';
    modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200';
    document.body.appendChild(modal);
  }

  const message = createZaloOrderMessage(order);

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in zoom-in duration-200">
      <button onclick="closeZaloSuccessModal()" class="absolute top-5 right-5 text-stone-400 hover:text-stone-700 text-xl transition">
        <i class="ph-bold ph-x"></i>
      </button>

      <div class="text-center space-y-2">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl shadow-inner">
          <svg class="w-10 h-10 fill-current" viewBox="0 0 48 48">
            <path d="M24 4C12.95 4 4 12.52 4 23.03C4 29.21 7.07 34.69 11.87 38.21C11.39 40.54 9.94 43.43 9.94 43.43C9.94 43.43 13.97 43.14 17.51 40.51C19.57 41.48 21.73 42.06 24 42.06C35.05 42.06 44 33.54 44 23.03C44 12.52 35.05 4 24 4Z" fill="#0068FF"/>
            <path d="M33.6 28.5C33 28.5 32.5 28.2 32.2 27.8L28.8 23.4L23.7 28.1C23.4 28.4 23 28.5 22.6 28.5C21.7 28.5 21 27.8 21 26.9V18.1C21 17.2 21.7 16.5 22.6 16.5C23.5 16.5 24.2 17.2 24.2 18.1V23.6L29.6 18.6C29.9 18.3 30.3 18.1 30.8 18.1C31.7 18.1 32.4 18.8 32.4 19.7V26.9C32.4 27.8 32.9 28.5 33.6 28.5Z" fill="white"/>
          </svg>
        </div>
        <h3 class="font-serif-title text-2xl font-bold text-stone-900">Đặt Hàng Thành Công!</h3>
        <p class="text-xs text-stone-500">Mã đơn hàng: <strong class="text-brand-700 font-mono">${order.id}</strong></p>
      </div>

      <div class="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2 text-stone-700">
        <div class="flex justify-between font-bold text-stone-900 pb-1 border-b border-stone-200">
          <span>Tổng tiền:</span>
          <span class="text-brand-700">${order.total}</span>
        </div>
        <div><strong>Người nhận:</strong> ${order.recipient} (${order.phone})</div>
        <div><strong>Địa chỉ:</strong> ${order.address}</div>
        <div class="text-[11px] text-emerald-700 font-medium pt-1">
          💡 Bấm nút xanh bên dưới để gửi thẳng đơn hàng sang Zalo của Chủ vườn xác nhận và nhận ảnh bưởi thật!
        </div>
      </div>

      <div class="space-y-2 pt-1">
        <button onclick="openZaloChat(\`${message.replace(/`/g, '\\`')}\`)" class="w-full bg-[#0068FF] hover:bg-[#0052cc] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/30 text-xs sm:text-sm transition flex items-center justify-center gap-2">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 48 48">
            <path d="M24 4C12.95 4 4 12.52 4 23.03C4 29.21 7.07 34.69 11.87 38.21C11.39 40.54 9.94 43.43 9.94 43.43C9.94 43.43 13.97 43.14 17.51 40.51C19.57 41.48 21.73 42.06 24 42.06C35.05 42.06 44 33.54 44 23.03C44 12.52 35.05 4 24 4Z" fill="white"/>
          </svg>
          <span>Gửi Đơn Qua Zalo Cho Chủ Vườn</span>
        </button>

        <button onclick="closeZaloSuccessModal()" class="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2.5 rounded-2xl text-xs transition">
          Đóng Cửa Sổ
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeZaloSuccessModal() {
  const modal = document.getElementById('zaloSuccessModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
  updateZaloUI();
});
