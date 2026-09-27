/**
 * MODULE XÁC THỰC V2.2 - ĐĂNG KÝ, ĐĂNG NHẬP, TÍCH ĐIỂM & QUẢN LÝ ĐƠN HÀNG
 * Hợp tác xã Nông sản & Đặc sản Đồng Nai
 * (v2.2: cấu trúc cho GitHub Pages — index.html = trang đăng nhập,
 *  home.html = trang chủ chính, vì GitHub Pages không hỗ trợ _redirects
 *  như Netlify nên phải đổi tên file thật thay vì rewrite.)
 */

// 1. Trạng thái người dùng hiện tại (Lưu tại localStorage)
let currentUser = JSON.parse(localStorage.getItem('htx_user') || 'null');

// 1.5 Bảo vệ trang: nếu chưa đăng nhập, tự động chuyển về index.html (trang đăng nhập)
// (bỏ qua khi đang đứng ngay tại index.html để tránh redirect loop)
(function requireAuthGuard() {
  const path = window.location.pathname;
  const isLoginPage = path.endsWith('index.html') || path.endsWith('/') || path === '';
  if (!currentUser && !isLoginPage) {
    window.location.replace('index.html');
  }
})();

// 2. Mở / Đóng Modal Đăng nhập & Đăng ký
function openAuthModal(tab = 'login') {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    switchAuthTab(tab);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// 3. Chuyển đổi tab Đăng nhập / Đăng ký
function switchAuthTab(tab) {
  const loginTabBtn = document.getElementById('loginTabBtn');
  const registerTabBtn = document.getElementById('registerTabBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (tab === 'login') {
    loginTabBtn.className = 'w-1/2 py-2.5 text-center text-xs sm:text-sm font-bold border-b-2 border-brand-600 text-brand-700 transition';
    registerTabBtn.className = 'w-1/2 py-2.5 text-center text-xs sm:text-sm font-medium border-b-2 border-transparent text-stone-500 hover:text-stone-800 transition';
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    registerTabBtn.className = 'w-1/2 py-2.5 text-center text-xs sm:text-sm font-bold border-b-2 border-brand-600 text-brand-700 transition';
    loginTabBtn.className = 'w-1/2 py-2.5 text-center text-xs sm:text-sm font-medium border-b-2 border-transparent text-stone-500 hover:text-stone-800 transition';
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

// 4. Bật / Tắt ẩn hiện mật khẩu (Show/Hide Password 👁️)
function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input || !icon) return;

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('ph-eye');
    icon.classList.add('ph-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('ph-eye-slash');
    icon.classList.add('ph-eye');
  }
}

// 5. Kiểm tra định dạng số điện thoại Việt Nam
function isValidVietnamesePhone(phone) {
  const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return re.test(phone.replace(/\s+/g, ''));
}

// 6. Xử lý Đăng Nhập
function handleLogin(e) {
  e.preventDefault();
  const phoneOrEmail = document.getElementById('loginIdentifier').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!phoneOrEmail || !password) {
    alert('Vui lòng nhập đầy đủ Số điện thoại/Email và Mật khẩu!');
    return;
  }

  currentUser = {
    name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Khách Thân Thiết',
    phone: phoneOrEmail,
    role: 'Hội viên Thân Thiết',
    points: 150
  };

  localStorage.setItem('htx_user', JSON.stringify(currentUser));
  updateAuthUI();
  autofillOrderForm();
  closeAuthModal();

  alert(`🎉 Chào mừng ${currentUser.name} quay trở lại HTX Đặc Sản Đồng Nai!\nThông tin người nhận đã được tự động điền sẵn vào đơn hàng của bạn.`);
}

// 7. Xử lý Đăng Ký
function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const role = document.getElementById('regRole').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  if (!isValidVietnamesePhone(phone)) {
    alert('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số (bắt đầu bằng 03, 05, 07, 08, 09).');
    return;
  }

  if (password.length < 6) {
    alert('Mật khẩu quá ngắn! Vui lòng đặt mật khẩu từ 6 ký tự trở lên để đảm bảo an toàn.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!');
    return;
  }

  currentUser = {
    name: name,
    phone: phone,
    role: role === 'farmer' ? 'Xã viên / Chủ Vườn' : 'Khách Hàng Thân Thiết',
    points: 50 // Tặng 50 điểm khởi đầu
  };

  localStorage.setItem('htx_user', JSON.stringify(currentUser));
  updateAuthUI();
  autofillOrderForm();
  closeAuthModal();

  alert(`🎉 Chúc mừng ${name} đã đăng ký thành viên thành công!\nBạn được tặng ngay 50 điểm tích lũy ưu đãi cho mùa vụ này.`);
}

// 8. Đăng nhập nhanh qua Zalo
function handleZaloLogin() {
  currentUser = {
    name: 'Anh Nam (Hội Viên Zalo)',
    phone: '0988.123.456',
    role: 'Hội viên Zalo Đã Xác Thực',
    points: 120
  };
  localStorage.setItem('htx_user', JSON.stringify(currentUser));
  updateAuthUI();
  autofillOrderForm();
  closeAuthModal();
  alert('Đã kết nối và xác thực tài khoản qua Zalo thành công!');
}

// 9. Đăng xuất
function handleLogout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
    localStorage.removeItem('htx_user');
    currentUser = null;
    updateAuthUI();
    // Xóa thông tin điền tự động nếu có
    const nameInput = document.getElementById('custName');
    const phoneInput = document.getElementById('custPhone');
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    alert('Đã đăng xuất tài khoản.');
    // Sau khi đăng xuất, đưa luôn về trang đăng nhập (index.html)
    window.location.href = 'index.html';
  }
}

// 10. Tự động điền Họ tên và SĐT vào Form Đặt Hàng khi đã đăng nhập
function autofillOrderForm() {
  if (!currentUser) return;
  const nameInput = document.getElementById('custName');
  const phoneInput = document.getElementById('custPhone');
  if (nameInput && !nameInput.value) nameInput.value = currentUser.name;
  if (phoneInput && !phoneInput.value) phoneInput.value = currentUser.phone;
}

// 11. Cập nhật giao diện Header theo người dùng
function updateAuthUI() {
  const authContainer = document.getElementById('authHeaderContainer');
  if (!authContainer) return;

  if (currentUser) {
    authContainer.innerHTML = `
      <div class="relative group">
        <button class="flex items-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 px-3 py-1.5 rounded-full text-xs font-semibold transition">
          <div class="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px] font-bold">
            ${currentUser.name.charAt(0).toUpperCase()}
          </div>
          <span class="max-w-[110px] truncate hidden sm:inline">${escapeHtml(currentUser.name)}</span>
          <i class="ph-bold ph-caret-down text-[10px]"></i>
        </button>

        <!-- Dropdown menu -->
        <div class="hidden group-hover:block absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs animate-in fade-in zoom-in duration-150">
          <div class="px-4 py-2 border-b border-stone-100">
            <div class="font-bold text-stone-900">${escapeHtml(currentUser.name)}</div>
            <div class="text-[10px] text-brand-700 font-medium">${currentUser.role}</div>
            <div class="text-[10px] text-amber-600 font-semibold mt-0.5">🌟 Tích lũy: ${currentUser.points} điểm</div>
          </div>
          <button onclick="openOrdersModal()" class="w-full text-left flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50 transition">
            <i class="ph ph-package text-sm text-brand-600"></i> Đơn hàng của tôi
          </button>
          <a href="#traceability" class="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50 transition">
            <i class="ph ph-qr-code text-sm text-brand-600"></i> Tra cứu tem nhà vườn
          </a>
          <button onclick="handleLogout()" class="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition border-t border-stone-100 mt-1">
            <i class="ph ph-sign-out text-sm"></i> Đăng xuất
          </button>
        </div>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="index.html" class="flex items-center gap-1.5 text-stone-700 hover:text-brand-600 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-full border border-stone-200 hover:border-brand-300 transition bg-white shadow-xs">
        <i class="ph-bold ph-user-circle text-base text-brand-600"></i>
        <span>Đăng Nhập / Đăng Ký</span>
      </a>
    `;
  }
}

// 12. Modal "Đơn Hàng Của Tôi" (My Orders)
function openOrdersModal() {
  const modal = document.getElementById('ordersModal');
  const container = document.getElementById('myOrdersList');
  if (!modal || !container) return;

  const orders = JSON.parse(localStorage.getItem('htx_orders') || '[]');

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-stone-400 space-y-2">
        <i class="ph ph-bag text-3xl"></i>
        <p class="text-xs">Bạn chưa có đơn hàng nào tại HTX Nông Sản Đồng Nai.</p>
        <a href="#products" onclick="closeOrdersModal()" class="inline-block text-xs font-bold text-brand-700 underline mt-2">Khám phá đặc sản ngay &rarr;</a>
      </div>
    `;
  } else {
    container.innerHTML = orders.map(order => `
      <div class="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2.5 text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-stone-200">
          <div>
            <span class="font-bold text-stone-800">Mã đơn: ${order.id}</span>
            <div class="text-[10px] text-stone-400">${order.date}</div>
          </div>
          <span class="bg-emerald-100 text-emerald-800 font-semibold text-[10px] px-2 py-0.5 rounded-full">
            ${order.status || 'Đang chuẩn bị tại vườn'}
          </span>
        </div>
        <div class="space-y-1 text-stone-600">
          ${order.items.map(i => `<div>• ${escapeHtml(i.name)} x ${i.quantity}</div>`).join('')}
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-stone-200 font-bold">
          <span class="text-stone-500 font-normal">Tổng thanh toán:</span>
          <span class="text-brand-700">${order.total}</span>
        </div>
        <div class="text-[11px] text-stone-400">
          Vận chuyển: <strong>${order.carrier || 'ViettelPost Bay Hỏa Tốc'}</strong>
        </div>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeOrdersModal() {
  const modal = document.getElementById('ordersModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// 13. Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  autofillOrderForm();

  // Đóng modal orders khi click ra ngoài
  const ordersModal = document.getElementById('ordersModal');
  if (ordersModal) {
    ordersModal.addEventListener('click', (e) => {
      if (e.target === ordersModal) closeOrdersModal();
    });
  }
});