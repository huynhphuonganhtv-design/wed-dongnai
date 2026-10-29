/**
 * MODULE CHATBOT AI "BÉ BA" V3.0 - TƯ VẤN ĐẶC SẢN ĐỒNG NAI
 * Cấu trúc lại với Regex Intent, chuẩn hóa UI & Sẵn sàng tích hợp API (Gemini/Webhook)
 */

// 1. Gợi ý nhanh
const QUICK_PROMPTS = [
  { label: "🍊 Cách chọn bưởi", query: "Cách chọn bưởi ngon" },
  { label: "🎁 Combo biếu sếp", query: "Tư vấn combo biếu sếp" },
  { label: "✈️ Phí ship Hà Nội", query: "Phí ship ra Hà Nội" },
  { label: "🌰 Vị hạt điều", query: "Hạt điều rang củi vị gì?" },
  { label: "🍶 Rượu bưởi", query: "Có rượu bưởi không?" },
  { label: "📑 Hóa đơn VAT", query: "Có xuất hóa đơn VAT không?" }
];

// 2. Cơ sở tri thức AI (Dùng Regex để bắt từ khóa thông minh hơn)
const AI_KNOWLEDGE = [
  {
    pattern: /(chọn bưởi|bưởi ngon|phân biệt|lá cam)/i,
    text: `<strong>Bí quyết chọn bưởi Tân Triều chuẩn ngon từ nhà vườn:</strong><br>
    • <strong>Dáng quả:</strong> Tròn đều, da láng bóng màu xanh hanh vàng.<br>
    • <strong>Cầm nặng tay:</strong> Cỡ 1.2kg - 1.4kg nhưng chắc nịch, cuống còn tươi xanh nguyên lá.<br>
    • <strong>Vị ngọt:</strong> Múi vàng ngà mọng nước, vị ngọt thanh đậm phù sa, càng để lâu càng ngọt!`,
    action: { btnText: "🛒 Đặt Bưởi Tân Triều (85k/kg)", onClick: "addToCart('Bưởi Đường Lá Cam Tân Triều', 85000)" }
  },
  {
    pattern: /(quà|combo|biếu|sếp|đối tác)/i,
    text: `Dạ bên em có <strong>Combo Quà Biếu 'Đất Đồng Nai Sum Vầy' (620k)</strong> bán chạy nhất:<br>
    • 02 Quả Bưởi Lá Cam loại 1 + 02 Hộp Điều Lụa Rang Củi 500g.<br>
    • Đóng hộp quà kraft trang nhã kèm thiệp viết tay.<br>
    <em>Rất lịch sự để biếu sếp, đối tác hoặc người thân ở xa!</em>`,
    action: { btnText: "🎁 Thêm Combo 620k Vào Giỏ", onClick: "addToCart('Combo Quà Biếu Đất Đồng Nai Sum Vầy', 620000)" }
  },
  {
    pattern: /(hà nội|miền bắc|ship|vận chuyển|xa)/i,
    text: `Dạ gửi ra miền Bắc bên em liên kết <strong>ViettelPost Bay Hỏa Tốc (24-36h)</strong>:<br>
    • Bọc lưới xốp từng quả, lót rơm đóng thùng đi máy bay.<br>
    • Tới tay cuống vẫn tươi xanh. <strong>Freeship</strong> đơn quà biếu từ 500k ạ!`,
    action: { btnText: "📍 Nhập Địa Chỉ Nhận Hàng", onClick: "document.getElementById('order').scrollIntoView({behavior: 'smooth'})" }
  },
  {
    pattern: /(điều|hạt điều|xuân lộc)/i,
    text: `Dạ hạt điều Xuân Lộc là <strong>Size cồ W240 loại A</strong>:<br>
    • Rang củi giữ nguyên lớp vỏ lụa, giòn béo tự nhiên, muối nhẹ (1%) không bị mặn gắt.<br>
    • Hút chân không 500g, bảo quản 12 tháng không gắt dầu!`,
    action: { btnText: "🛒 Mua Điều Lụa 500g (165k)", onClick: "addToCart('Hạt Điều Lụa Rang Củi (Hộp 500g)', 165000)" }
  },
  {
    pattern: /(mãng cầu|na|thạnh phú)/i,
    text: `Dạ <strong>Mãng Cầu Dai Thạnh Phú (Hữu cơ)</strong>:<br>
    • Nở gai đều, mắt to, múi dai dày, ít hạt và ngọt đậm đà.<br>
    • Giá ưu đãi chỉ 75.000đ/kg!`,
    action: { btnText: "🛒 Đặt Mãng Cầu Hữu Cơ", onClick: "addToCart('Mãng Cầu Dai Chuẩn Hữu Cơ', 75000)" }
  },
  {
    pattern: /(rượu|rượu bưởi)/i,
    text: `Dạ HTX có <strong>Rượu Bưởi Tân Triều bình gốm</strong>:<br>
    • Nồng độ 15° êm dịu, lên men tự nhiên.<br>
    • Uống thơm mát, hỗ trợ tiêu hóa, làm quà biếu đậm phong vị quê hương!`,
    action: { btnText: "📞 Báo Giá Rượu Qua Zalo", onClick: "window.open('https://zalo.me', '_blank')" }
  },
  {
    pattern: /(vat|hóa đơn|công ty|doanh nghiệp|sỉ)/i,
    text: `Dạ HTX có <strong>xuất Hóa đơn điện tử VAT</strong> đầy đủ.<br>
    • Chiết khấu 5% - 15% cho đơn doanh nghiệp.<br>
    • Hỗ trợ in logo thiệp chúc mừng riêng!`,
    action: { btnText: "💬 Kết Nối Zalo Báo Giá", onClick: "window.open('https://zalo.me', '_blank')" }
  },
  {
    pattern: /(bảo hành|đổi trả|hư|dập)/i,
    text: `HTX cam kết <strong>BẢO HÀNH 1 ĐỔI 1 TRONG 48H</strong>:<br>
    • Nếu bưởi sượng cay hoặc bị dập nát khi vận chuyển.<br>
    • Quý khách gửi ảnh qua Zalo, bên em đổi ngay hàng mới 100% miễn phí!`,
    action: null
  }
];

const DEFAULT_REPLY = {
  text: `Dạ em là Bé Ba - Trợ lý AI HTX Nông Sản. Em hỗ trợ anh/chị chọn bưởi, kiểm tra mã vùng trồng hoặc phối set quà tặng.<br>Anh/chị cứ nhắn yêu cầu nhé!`,
  action: { btnText: "📝 Đến Form Đặt Hàng", onClick: "document.getElementById('order').scrollIntoView({behavior: 'smooth'})" }
};

// 3. Hàm xử lý logic phản hồi (Tích hợp sẵn Async để cắm API thật)
async function getAiResponse(userText) {
  // [BẢN NÂNG CẤP API TƯƠNG LAI]
  // Nếu bạn dùng Gemini AI, mở comment đoạn này và thay API_KEY:
  /*
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: userText }] }] })
    });
    const data = await res.json();
    return { text: data.candidates[0].content.parts[0].text, action: null };
  } catch(e) { console.error(e); }
  */

  // Logic Offline hiện tại (Dùng Regex để dò tìm Intent)
  const match = AI_KNOWLEDGE.find(item => item.pattern.test(userText));
  return match ? { text: match.text, action: match.action } : DEFAULT_REPLY;
}

// 4. UI: Hàm Render Giao Diện Tin Nhắn Dùng Chung (Giúp code gọn hơn)
function renderMessage(containerId, text, type, action = null, isFloating = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const msgDiv = document.createElement('div');
  const sizeClass = isFloating ? 'text-[10px] p-2' : 'text-xs p-3';
  const iconSize = isFloating ? 'w-6 h-6 text-[10px]' : 'w-7 h-7 text-xs';

  if (type === 'user') {
    msgDiv.className = 'flex justify-end mb-3 animate-fade-in-up';
    msgDiv.innerHTML = `<div class="bg-brand-600 text-white ${sizeClass} rounded-2xl rounded-tr-none max-w-[80%] leading-relaxed shadow-sm">${escapeHtml(text)}</div>`;
  } else {
    msgDiv.className = 'flex items-start gap-2 mb-3 animate-fade-in-up';
    let btnHtml = action ? `
      <div class="mt-2 ${isFloating ? '' : 'pt-2 border-t border-stone-200'}">
        <button onclick="${action.onClick}" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-1.5 px-3 rounded-xl ${isFloating ? 'text-[10px]' : 'text-[11px]'} transition shadow-sm text-center">
          ${action.btnText}
        </button>
      </div>` : '';

    msgDiv.innerHTML = `
      <div class="${iconSize} rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">AI</div>
      <div class="bg-white border border-stone-100 text-stone-800 ${sizeClass} rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed shadow-sm">
        <div>${text}</div>
        ${btnHtml}
      </div>
    `;
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

// 5. UI: Typing Indicator (Hiệu ứng đang gõ)
function toggleTyping(containerId, isShow, isFloating = false) {
  const container = document.getElementById(containerId);
  const typingId = 'typing_' + containerId;
  
  if (!isShow) {
    const el = document.getElementById(typingId);
    if (el) el.remove();
    return;
  }

  const iconSize = isFloating ? 'w-6 h-6 text-[10px]' : 'w-7 h-7 text-xs';
  const sizeClass = isFloating ? 'p-2 text-[10px]' : 'py-2.5 px-4 text-xs';

  const typingDiv = document.createElement('div');
  typingDiv.id = typingId;
  typingDiv.className = 'flex items-start gap-2 mb-3';
  typingDiv.innerHTML = `
    <div class="${iconSize} rounded-full bg-stone-300 text-white flex items-center justify-center flex-shrink-0">AI</div>
    <div class="bg-stone-100 text-stone-500 ${sizeClass} rounded-2xl rounded-tl-none flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]"></span>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
}

// 6. Xử lý Gửi Tin Nhắn (Hỗ trợ Async/Await)
async function handleSendMsg(inputId, containerId, isFloating = false) {
  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) return;

  const userText = input.value.trim();
  input.value = ''; // Clear input
  
  // Render user text
  renderMessage(containerId, userText, 'user', null, isFloating);
  
  // Show typing
  toggleTyping(containerId, true, isFloating);

  // Fetch AI Response (Giả lập delay API 600ms - 1000ms để giống thật)
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(700); 
  
  const aiReply = await getAiResponse(userText);
  
  // Hide typing & Render AI text
  toggleTyping(containerId, false, isFloating);
  renderMessage(containerId, aiReply.text, 'ai', aiReply.action, isFloating);
}

// Wrappers cho các nút HTML
function sendChatMessage() { handleSendMsg('userChatInput', 'chatMessages', false); }
function sendFloatingMessage() { handleSendMsg('floatingInput', 'floatingChatMessages', true); }

function quickFillPrompt(text, isFloating = false) {
  const inputId = isFloating ? 'floatingInput' : 'userChatInput';
  const input = document.getElementById(inputId);
  if (input) {
    input.value = text;
    isFloating ? sendFloatingMessage() : sendChatMessage();
  }
}

// 7. Render Thanh Gợi ý & Khởi tạo Event Listeners
function renderQuickPrompts(containerId, isFloating = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const chipsHtml = QUICK_PROMPTS.map(p => `
    <button onclick="quickFillPrompt('${p.query}', ${isFloating})" 
      class="inline-block bg-white hover:bg-brand-50 text-stone-600 hover:text-brand-700 border border-stone-200 px-2.5 py-1 rounded-full text-[11px] font-medium transition shadow-xs whitespace-nowrap">
      ${p.label}
    </button>
  `).join('');

  container.innerHTML = `
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
      <span class="text-[10px] text-stone-400 font-bold uppercase whitespace-nowrap flex-shrink-0">Gợi ý:</span>
      ${chipsHtml}
    </div>
  `;
}

// Bật/tắt chat widget nổi
function toggleFloatingChat() {
  const win = document.getElementById('floatingChatWindow');
  if (win) {
    win.classList.toggle('hidden');
    renderQuickPrompts('floatingQuickPrompts', true);
    setTimeout(() => document.getElementById('floatingInput')?.focus(), 100);
  }
}

// Khởi chạy khi web load
document.addEventListener('DOMContentLoaded', () => {
  renderQuickPrompts('chatQuickPrompts', false);
  
  // Hỗ trợ bấm phím Enter để gửi chat
  const setupEnterKey = (inputId, sendFunc) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendFunc();
        }
      });
    }
  };
  
  setupEnterKey('userChatInput', sendChatMessage);
  setupEnterKey('floatingInput', sendFloatingMessage);
});
