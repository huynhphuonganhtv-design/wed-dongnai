/**
 * MODULE MODAL TRUY XUẤT NGUỒN GỐC MÃ QR - V2.0
 */

function openQrModal(id) {
  // 1. Lấy dữ liệu an toàn
  const data = TRACE_DATABASE[id] || TRACE_DATABASE['TAN-TRIEU-01'];
  if (!data) return;

  // 2. Gán dữ liệu vào DOM bằng Optional Chaining
  const setText = (elemId, val) => {
    const el = document.getElementById(elemId);
    if (el) el.innerText = val || 'Đang cập nhật';
  };

  setText('qrModalCode', data.code);
  setText('qrModalOwner', data.owner);
  setText('qrModalLocation', data.location);
  setText('qrModalStandard', data.standard);
  
  const modalImg = document.getElementById('qrModalImg');
  if (modalImg) modalImg.src = data.qrUrl || 'default-qr.png';

  // 3. Render Timeline nâng cấp (Steppers: có vạch dọc và icon)
  const timelineContainer = document.getElementById('qrTimelineContainer');
  if (timelineContainer && data.timeline) {
    timelineContainer.innerHTML = data.timeline.map((item, index) => {
      // Giả sử mảng xếp từ mới nhất -> cũ nhất. Phần tử index === 0 là trạng thái hiện tại.
      const isLatest = index === 0; 
      const dotColor = isLatest ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-stone-300';
      const textColor = isLatest ? 'text-emerald-700 font-bold' : 'text-stone-700 font-medium';
      
      return `
        <div class="relative pl-6 pb-4 last:pb-0">
          <!-- Vạch dọc nối các bước -->
          ${index !== data.timeline.length - 1 ? '<div class="absolute top-2 left-[5px] bottom-0 w-[2px] bg-stone-200"></div>' : ''}
          
          <!-- Dấu chấm tròn -->
          <div class="absolute top-1.5 left-0 w-3 h-3 rounded-full ${dotColor} z-10 transition-all"></div>
          
          <!-- Nội dung -->
          <div class="text-[11px] text-stone-400 font-medium mb-0.5 flex items-center gap-1">
             <i class="ph-fill ph-clock"></i> ${escapeHtml(item.time)}
          </div>
          <div class="${textColor}">${escapeHtml(item.desc)}</div>
        </div>
      `;
    }).join('');
  }

  // 4. Hiển thị Modal với hiệu ứng Fade-in
  const modal = document.getElementById('qrModal');
  const modalContent = document.getElementById('qrModalContent'); 
  
  if (modal) {
    modal.classList.remove('hidden');
    
    // setTimeout nhỏ để CSS transition kích hoạt
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      if (modalContent) modalContent.classList.remove('scale-95', 'opacity-0');
    }, 10);
    
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang

    // Lắng nghe sự kiện thông minh
    modal.addEventListener('mousedown', handleBackdropClick);
    document.addEventListener('keydown', handleEscKey);
  }
}

function closeQrModal() {
  const modal = document.getElementById('qrModal');
  const modalContent = document.getElementById('qrModalContent');
  
  if (modal) {
    // Hiệu ứng Fade-out
    modal.classList.add('opacity-0');
    if (modalContent) modalContent.classList.add('scale-95', 'opacity-0');
    
    // Đợi transition CSS chạy xong (thường 200-300ms với Tailwind) mới ẩn DOM
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);

    // Gỡ bỏ Listeners để tối ưu hiệu suất
    modal.removeEventListener('mousedown', handleBackdropClick);
    document.removeEventListener('keydown', handleEscKey);
  }
}

// --- CÁC HÀM TIỆN ÍCH CHO MODAL ---

// Đóng khi click ra ngoài vùng tối (Backdrop)
function handleBackdropClick(e) {
  if (e.target.id === 'qrModal') {
    closeQrModal();
  }
}

// Đóng khi bấm phím ESC
function handleEscKey(e) {
  if (e.key === 'Escape') {
    closeQrModal();
  }
}

// Tính năng Copy mã Truy xuất
function copyTraceCode() {
  const codeStr = document.getElementById('qrModalCode')?.innerText;
  if (!codeStr) return;
  
  navigator.clipboard.writeText(codeStr).then(() => {
    // Nếu bạn có hàm showToast() ở module khác thì gọi nó
    if (typeof showToast === 'function') {
