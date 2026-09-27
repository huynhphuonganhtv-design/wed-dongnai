/**
 * MODULE AI THÔNG MINH - GỢI Ý COMBO QUÀ TẶNG THEO NGÂN SÁCH
 */

let selectedPurpose = 'bieu-tang';
let selectedBudget = '500-1000';

function selectPurpose(btn, purpose) {
  document.querySelectorAll('.purpose-btn').forEach(b => {
    b.className = 'purpose-btn border border-stone-300 hover:border-brand-500 py-2 px-3 rounded-xl text-xs text-center font-medium transition';
  });
  btn.className = 'purpose-btn border-2 border-brand-600 bg-brand-50 text-brand-800 font-semibold py-2 px-3 rounded-xl text-xs text-center transition';
  selectedPurpose = purpose;
}

function selectBudget(btn, budget) {
  document.querySelectorAll('.budget-btn').forEach(b => {
    b.className = 'budget-btn border border-stone-300 hover:border-brand-500 py-2 px-3 rounded-xl text-xs text-center font-medium transition';
  });
  btn.className = 'budget-btn border-2 border-brand-600 bg-brand-50 text-brand-800 font-semibold py-2 px-3 rounded-xl text-xs text-center transition';
  selectedBudget = budget;
}

function generateAiCombo() {
  const titleEl = document.getElementById('comboTitle');
  const descEl = document.getElementById('comboDesc');
  const priceEl = document.getElementById('comboPrice');
  
  if (!titleEl || !descEl || !priceEl) return;

  const combo = AI_COMBO_PRESETS[selectedBudget] || AI_COMBO_PRESETS['500-1000'];
  
  titleEl.innerText = combo.title;
  descEl.innerHTML = combo.desc;
  priceEl.innerHTML = `${combo.price.toLocaleString('vi-VN')}đ <span class="text-xs text-emerald-600 font-semibold">(${combo.saving})</span>`;
}

function applyComboToCart() {
  const title = document.getElementById('comboTitle').innerText;
  const combo = AI_COMBO_PRESETS[selectedBudget] || AI_COMBO_PRESETS['500-1000'];

  cart.push({ name: title, price: combo.price, quantity: 1 });
  renderCart();
  alert(`Đã thêm "${title}" vào giỏ hàng! Mời bạn hoàn tất thông tin người nhận ở bên dưới.`);
  
  const orderSec = document.getElementById('order');
  if (orderSec) orderSec.scrollIntoView({ behavior: 'smooth' });
}
