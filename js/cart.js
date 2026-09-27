/**
 * MODULE GIỎ HÀNG & ĐẶT HÀNG V2.0 - ĐẶC SẢN ĐỒNG NAI
 * Nâng cấp:
 * 1. Nút tăng giảm số lượng (+ / -) trực tiếp trong giỏ.
 * 2. Tự động tính phí vận chuyển & Thanh tiến trình Freeship từ 500k.
 * 3. Hệ thống Mã giảm giá / Voucher ưu đãi (Ví dụ: DONGNAI10, FREESHIP).
 * 4. Tự động tạo mã chuyển khoản VietQR chính xác số tiền.
 * 5. Mở ứng dụng Zalo gửi đơn hàng trực tiếp tới chủ vườn.
 */

// Giỏ hàng ban đầu
let cart = [
  { name: "Bưởi Đường Lá Cam Tân Triều (1 Trái ~1.3kg)", price: 110000, quantity: 1 }
];

// Trạng thái Voucher & Vận chuyển
let appliedVoucher = null;
const VOUCHERS = {
  'DONGNAI10': { discountPercent: 10, label: 'Giảm 10% tổng đơn' },
  'FREESHIP': { freeShipping: true, label: 'Miễn phí giao hàng toàn quốc' },
  'HTX50K': { discountAmount: 50000, label: 'Giảm 50.000đ cho đơn từ 400k', minOrder: 400000 }
};

// 1. Render giỏ hàng với đầy đủ nút bấm (+ / -) và tính toán chi tiết
function renderCart() {
  const container = document.getElementById('cartItemsList');
  const totalEl = document.getElementById('cartTotalPrice');
  const shippingEl = document.getElementById('cartShippingFee');
  const discountEl = document.getElementById('cartDiscountRow');
  const freeshipProgressEl = document.getElementById('freeshipProgressBar');
  const freeshipTextEl = document.getElementById('freeshipText');

  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `<div class="text-stone-400 italic py-3 text-center">Chưa có sản phẩm nào trong giỏ. Mời bạn chọn đặc sản bên trên.</div>`;
    totalEl.innerText = "0đ";
    if (shippingEl) shippingEl.innerText = "0đ";
    if (freeshipProgressEl) freeshipProgressEl.style.width = '0%';
    if (freeshipTextEl) freeshipTextEl.innerText = 'Mua thêm để nhận Freeship toàn quốc!';
    return;
  }

  // Tính tiền hàng tạm tính
  let subtotal = 0;
  container.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    return `
      <div class="flex items-center justify-between py-2 border-b border-stone-100 last:border-none text-xs">
        <div class="flex-1 pr-2">
          <div class="font-semibold text-stone-800">${escapeHtml(item.name)}</div>
          <div class="text-stone-400 text-[11px]">${item.price.toLocaleString('vi-VN')}đ / phần</div>
        </div>
        
        <!-- Nút tăng / giảm số lượng (+ / -) -->
        <div class="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1">
          <button onclick="changeQuantity(${index}, -1)" class="w-5 h-5 bg-white rounded flex items-center justify-center font-bold text-stone-600 hover:bg-stone-200 transition shadow-2xs">
            -
          </button>
          <span class="w-6 text-center font-bold text-stone-800 text-xs">${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)" class="w-5 h-5 bg-white rounded flex items-center justify-center font-bold text-stone-600 hover:bg-stone-200 transition shadow-2xs">
            +
          </button>
        </div>

        <div class="w-24 text-right font-bold text-stone-800">
          ${itemTotal.toLocaleString('vi-VN')}đ
        </div>

        <button onclick="removeFromCart(${index})" class="ml-2 text-stone-400 hover:text-red-500 transition p-1" title="Xóa món này">
          <i class="ph-bold ph-trash"></i>
        </button>
      </div>
    `;
  }).join('');

  // 2. Tính phí vận chuyển (Freeship từ 500k hoặc dùng mã FREESHIP)
  const isFreeShip = subtotal >= 500000 || (appliedVoucher && appliedVoucher.freeShipping);
  const shippingFee = (subtotal === 0 || isFreeShip) ? 0 : 35000;

  // Thanh tiến trình Freeship
  if (freeshipProgressEl && freeshipTextEl) {
    const percent = Math.min(100, Math.round((subtotal / 500000) * 100));
    freeshipProgressEl.style.width = percent + '%';
    if (subtotal >= 500000) {
      freeshipTextEl.innerHTML = `<span class="text-emerald-700 font-bold">🎉 Chúc mừng bạn: Đã được MIỄN PHÍ VẬN CHUYỂN toàn quốc!</span>`;
    } else {
      const remaining = 500000 - subtotal;
      freeshipTextEl.innerHTML = `Mua thêm <strong class="text-brand-700">${remaining.toLocaleString('vi-VN')}đ</strong> nữa để nhận <strong>Freeship toàn quốc</strong>!`;
    }
  }

  // 3. Tính giảm giá Voucher
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountPercent) {
      discountAmount = Math.round((subtotal * appliedVoucher.discountPercent) / 100);
    } else if (appliedVoucher.discountAmount) {
      if (!appliedVoucher.minOrder || subtotal >= appliedVoucher.minOrder) {
        discountAmount = appliedVoucher.discountAmount;
      }
    }
  }

  if (discountEl) {
    if (discountAmount > 0) {
      discountEl.classList.remove('hidden');
      discountEl.innerHTML = `
        <span class="text-emerald-700 font-semibold">Giảm giá voucher:</span>
        <span class="font-bold text-emerald-700">-${discountAmount.toLocaleString('vi-VN')}đ</span>
      `;
    } else {
      discountEl.classList.add('hidden');
    }
  }

  // 4. Tổng thanh toán cuối cùng
  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  if (shippingEl) {
    shippingEl.innerHTML = isFreeShip 
      ? `<span class="text-emerald-600 font-semibold line-through text-stone-400 mr-1">35.000đ</span> <span class="text-emerald-700 font-bold">Miễn phí</span>` 
      : `${shippingFee.toLocaleString('vi-VN')}đ`;
  }

  totalEl.innerText = finalTotal.toLocaleString('vi-VN') + "đ";

  // Cập nhật lại mã QR thanh toán nếu đang chọn hình thức chuyển khoản
  updateVietQR(finalTotal);
}

// 2. Tăng giảm số lượng
function changeQuantity(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

// 3. Thêm vào giỏ
function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  renderCart();
  showToast(`Đã thêm "${name}" vào giỏ hàng!`);
  const orderSec = document.getElementById('order');
  if (orderSec) orderSec.scrollIntoView({ behavior: 'smooth' });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  cart = [];
  appliedVoucher = null;
  renderCart();
}

// 4. Áp dụng Mã Giảm Giá
function applyVoucherCode() {
  const input = document.getElementById('voucherInput');
  const msgEl = document.getElementById('voucherMessage');
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (!code) {
    alert('Vui lòng nhập mã giảm giá (Thử: DONGNAI10 hoặc FREESHIP)');
    return;
  }

  if (VOUCHERS[code]) {
    appliedVoucher = VOUCHERS[code];
    renderCart();
    if (msgEl) {
      msgEl.className = 'text-xs text-emerald-600 font-semibold mt-1 block';
      msgEl.innerText = `Áp dụng thành công mã ${code}: ${appliedVoucher.label}`;
    }
  } else {
    if (msgEl) {
      msgEl.className = 'text-xs text-red-500 font-medium mt-1 block';
      msgEl.innerText = `Mã "${code}" không hợp lệ hoặc đã hết hạn!`;
    }
  }
}

// 5. Cập nhật mã VietQR ngân hàng theo đúng số tiền
function updateVietQR(amount) {
  const qrImg = document.getElementById('vietQrImage');
  const qrSection = document.getElementById('vietQrSection');
  if (!qrImg || !qrSection) return;

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
  if (paymentMethod && paymentMethod.value === 'banking') {
    qrSection.classList.remove('hidden');
    // VietQR Demo: MB Bank HTX Nông Sản Đồng Nai
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=2|99|0988888888|HTX%20NONG%20SAN%20DONG%20NAI|${amount}|Chuyen%20khoan%20dac%20san`;
  } else {
    qrSection.classList.add('hidden');
  }
}

// 6. Xử lý Đặt hàng & Mở Zalo
function handleOrderSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const addr = document.getElementById('custAddress').value.trim();
  const notes = document.getElementById('custNotes').value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cod';

  if (cart.length === 0) {
    alert("Vui lòng chọn ít nhất 1 sản phẩm nông sản để đặt hàng!");
    return;
  }

  const totalPrice = document.getElementById('cartTotalPrice').innerText;
  const itemsText = cart.map(i => `- ${i.name} (SL: ${i.quantity})`).join('\n');

  // Lưu đơn vào danh sách
  const existingOrders = JSON.parse(localStorage.getItem('htx_orders') || '[]');
  const newOrder = {
    id: 'ĐN-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
    items: JSON.parse(JSON.stringify(cart)),
    total: totalPrice,
    recipient: name,
    phone: phone,
    address: addr,
    paymentMethod: paymentMethod === 'banking' ? 'Chuyển khoản VietQR' : 'Thanh toán khi nhận hàng (COD)',
    carrier: 'ViettelPost Bay Hỏa Tốc (24-36h)',
    status: 'Đang hái & đóng gói tại vườn'
  };

  existingOrders.unshift(newOrder);
  localStorage.setItem('htx_orders', JSON.stringify(existingOrders));

  // Tích 20 điểm hội viên
  if (typeof currentUser !== 'undefined' && currentUser) {
    currentUser.points = (currentUser.points || 0) + 20;
    localStorage.setItem('htx_user', JSON.stringify(currentUser));
    if (typeof updateAuthUI === 'function') updateAuthUI();
  }

  // Mở popup gửi đơn hàng trực tiếp qua Zalo
  if (typeof showZaloSuccessModal === 'function') {
    showZaloSuccessModal(newOrder);
  } else {
    alert(`🎉 Đơn hàng ${newOrder.id} đã được tạo thành công! Tổng tiền: ${totalPrice}`);
  }

  clearCart();
  document.getElementById('orderForm').reset();
}

// Toast thông báo nhỏ góc màn hình
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'fixed top-5 right-5 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transition-all transform duration-300 translate-y-[-20px] opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="ph-bold ph-check-circle text-emerald-400 text-base"></i> <span>${escapeHtml(message)}</span>`;
  toast.classList.remove('translate-y-[-20px]', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-20px]', 'opacity-0');
  }, 2500);
}
