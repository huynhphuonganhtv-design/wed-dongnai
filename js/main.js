/**
 * ENTRY POINT CHÍNH (MAIN.JS) - ĐẶC SẢN ĐỒNG NAI
 */

// Hàm lọc ký tự đặc biệt chống XSS
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Khởi chạy khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo giỏ hàng
  renderCart();

  // 2. Lắng nghe phím Escape để đóng Modal QR
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQrModal();
    }
  });

  // 3. Đóng modal khi click ra ngoài vùng backdrop
  const modalBackdrop = document.getElementById('qrModal');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeQrModal();
      }
    });
  }

  console.log('🌾 Đã tải thành công hệ thống Nông sản Đặc sản Đồng Nai.');
});
