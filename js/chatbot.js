/**
 * MODULE CHATBOT AI "BÉ BA" V2.0 - TƯ VẤN ĐẶC SẢN ĐỒNG NAI
 * Nâng cấp:
 * 1. Nút gợi ý nhanh 1-chạm (Quick Replies).
 * 2. Hiệu ứng đang gõ tin nhắn (Typing indicator).
 * 3. Nút hành động đặt hàng trực tiếp ngay trong tin nhắn AI.
 * 4. Kịch bản mở rộng: Mãng cầu, Rượu bưởi, Xuất hóa đơn VAT, Bảo hành.
 * 5. Tích hợp sẵn khung kết nối Gemini AI / Zalo Webhook.
 */

// Danh sách gợi ý nhanh hiển thị cho khách
const QUICK_PROMPTS = [
  { label: "🍊 Cách chọn bưởi ngon", query: "Cách chọn bưởi ngon" },
  { label: "🎁 Combo biếu sếp 620k", query: "Tư vấn combo biếu sếp" },
  { label: "✈️ Phí ship ra Hà Nội", query: "Phí ship ra Hà Nội" },
  { label: "🌰 Hạt điều có cay/mặn không?", query: "Hạt điều rang củi vị gì?" },
  { label: "🍶 Rượu bưởi Tân Triều", query: "Có rượu bưởi không?" },
  { label: "📑 Hóa đơn VAT doanh nghiệp", query: "Có xuất hóa đơn VAT không?" }
];

// Cơ sở tri thức nâng cao của Trợ lý AI Bé Ba
function getAiReplyAdvanced(userText) {
  const lower = userText.toLowerCase();

  // 1. Phân biệt & chọn bưởi
  if (lower.includes("chọn bưởi") || lower.includes("bưởi ngon") || lower.includes("phân biệt") || lower.includes("lá cam")) {
    return {
      text: `<strong>Bí quyết chọn bưởi Tân Triều chuẩn ngon từ nhà vườn:</strong><br>
      • <strong>Dáng quả:</strong> Tròn đều, da láng bóng màu xanh hanh vàng.<br>
      • <strong>Cầm nặng tay:</strong> Cỡ 1.2kg - 1.4kg nhưng chắc nịch, cuống còn tươi xanh nguyên lá.<br>
      • <strong>Vị ngọt:</strong> Múi vàng ngà mọng nước, vị ngọt thanh đậm phù sa, càng để 10-15 ngày sau hái càng xuống nước ngọt lịm không một chút đắng hậu!`,
      action: {
        btnText: "🛒 Đặt 1 Trái Bưởi Tân Triều (85k/kg)",
        onClick: "addToCart('Bưởi Đường Lá Cam Tân Triều', 85000)"
      }
    };
  }

  // 2. Tư vấn quà biếu / combo sếp / doanh nghiệp
  if (lower.includes("quà") || lower.includes("combo") || lower.includes("biếu") || lower.includes("sếp") || lower.includes("đối tác")) {
    return {
      text: `Dạ bên em có <strong>Combo Quà Biếu 'Đất Đồng Nai Sum Vầy' (620.000đ)</strong> đang bán chạy nhất:<br>
      • <strong>02 Quả Bưởi Lá Cam loại 1</strong> tuyển chọn cuống lá tươi xanh.<br>
      • <strong>02 Hộp Điều Lụa Rang Củi 500g</strong> (Size cồ W240).<br>
      • Đóng hộp quà kraft trang nhã kèm thiệp viết tay theo yêu cầu.<br>
      <em>Rất lịch sự để biếu sếp, đối tác hoặc người thân ở xa!</em>`,
      action: {
        btnText: "🎁 Thêm Combo 620k Vào Giỏ Hàng",
        onClick: "addToCart('Combo Quà Biếu Đất Đồng Nai Sum Vầy', 620000)"
      }
    };
  }

  // 3. Vận chuyển Hà Nội / Miền Bắc / Đường xa
  if (lower.includes("hà nội") || lower.includes("miền bắc") || lower.includes("ship") || lower.includes("vận chuyển") || lower.includes("xa")) {
    return {
      text: `Dạ gửi ra Hà Nội hoặc miền Bắc bên em liên kết <strong>ViettelPost Bay Hỏa Tốc chỉ 24 - 36h</strong>:<br>
      • Bưởi được bọc lưới xốp từng quả, lót rơm đóng thùng chuyên dụng đi máy bay.<br>
      • Tới tay cuống vẫn còn tươi nguyên lá, đảm bảo không bị dập nát hay bầm vỏ.<br>
      • <strong>Miễn phí ship</strong> toàn quốc cho đơn quà biếu từ 500.000đ ạ!`,
      action: {
        btnText: "📍 Nhập Địa Chỉ Nhận Hàng",
        onClick: "document.getElementById('order').scrollIntoView({behavior: 'smooth'})"
      }
    };
  }

  // 4. Hạt điều Xuân Lộc
  if (lower.includes("điều") || lower.includes("hạt điều") || lower.includes("xuân lộc")) {
    return {
      text: `Dạ hạt điều Xuân Lộc là <strong>Size cồ W240 loại A xuất khẩu</strong>, thổ nhưỡng đất đỏ bazan:<br>
      • <strong>Vị giác:</strong> Rang củi giữ nguyên lớp vỏ lụa, giòn rụm béo ngậy tự nhiên, chỉ thêm chút muối nhẹ (1%) không bị mặn gắt.<br>
      • <strong>Bảo quản:</strong> Đóng hộp hút chân không 500g, để được 12 tháng không gắt dầu!`,
      action: {
        btnText: "🛒 Mua Hộp Điều Lụa 500g (165k)",
        onClick: "addToCart('Hạt Điều Lụa Rang Củi (Hộp 500g)', 165000)"
      }
    };
  }

  // 5. Mãng cầu Thạnh Phú
  if (lower.includes("mãng cầu") || lower.includes("na") || lower.includes("thạnh phú")) {
    return {
      text: `Dạ <strong>Mãng Cầu Dai Thạnh Phú</strong> được canh tác theo hướng hữu cơ sinh học:<br>
      • Trái nở gai đều, mắt to phẳng, múi dai dày, ít hạt và ngọt đậm đà.<br>
      • Sau khi nhận hàng, chỉ 1-2 ngày là trái chín thơm nức cả nhà. Giá chỉ 75.000đ/kg!`,
      action: {
        btnText: "🛒 Đặt Mãng Cầu Hữu Cơ",
        onClick: "addToCart('Mãng Cầu Dai Chuẩn Hữu Cơ', 75000)"
      }
    };
  }

  // 6. Rượu bưởi Tân Triều
  if (lower.includes("rượu") || lower.includes("rượu bưởi")) {
    return {
      text: `Dạ HTX có sản phẩm <strong>Rượu Bưởi Tân Triều bình gốm hình trái bưởi</strong> truyền thống:<br>
      • Nồng độ 15° êm dịu, lên men tự nhiên từ nước cốt bưởi và mật hoa.<br>
      • Uống rất thơm mát, hỗ trợ tiêu hóa tốt và làm quà biếu mang đậm phong vị quê hương!`,
      action: {
        btnText: "📞 Nhận Báo Giá Rượu Bưởi Qua Zalo",
        onClick: "window.open('https://zalo.me', '_blank')"
      }
    };
  }

  // 7. Hóa đơn VAT / Doanh nghiệp
  if (lower.includes("vat") || lower.includes("hóa đơn") || lower.includes("công ty") || lower.includes("doanh nghiệp") || lower.includes("sỉ")) {
    return {
      text: `Dạ HTX Nông Sản Đặc Sản Đồng Nai có <strong>xuất đầy đủ Hóa đơn điện tử VAT</strong> cho công ty, doanh nghiệp mua làm quà tặng công nhân viên hoặc đối tác.<br>
      • Chiết khấu từ 5% - 15% cho đơn số lượng lớn.<br>
      • Hỗ trợ in logo thiệp chúc mừng riêng của doanh nghiệp!`,
      action: {
        btnText: "💬 Kết Nối Zalo Báo Giá Doanh Nghiệp",
        onClick: "window.open('https://zalo.me', '_blank')"
      }
    };
  }

  // 8. Bảo hành & cam kết
  if (lower.includes("bảo hành") || lower.includes("đổi trả") || lower.includes("hư") || lower.includes("dập")) {
    return {
      text: `HTX cam kết <strong>BẢO HÀNH 1 ĐỔI 1 TRONG 48H</strong>:<br>
      • Nếu bưởi bị khô đầu múi, sượng cay hoặc bị dập nát khi vận chuyển.<br>
      • Quý khách chỉ cần chụp ảnh gửi qua Zalo, bên em sẽ gửi lại hàng mới ngay lập tức mà không thu thêm bất kỳ chi phí nào!`,
      action: null
    };
  }

  // Câu trả lời mặc định thông minh
  return {
    text: `Dạ em là Bé Ba - Trợ lý AI HTX Nông Sản Đồng Nai. Em có thể hỗ trợ anh/chị chọn bưởi Tân Triều tươi ngọt, kiểm tra mã QR vùng trồng VietGAP hoặc phối set quà tặng doanh nghiệp.<br>
    Anh/chị có thể bấm các gợi ý nhanh bên dưới hoặc để lại số điện thoại để bên em hỗ trợ ngay nhé!`,
    action: {
      btnText: "📝 Đến Form Đặt Hàng Nhanh",
      onClick: "document.getElementById('order').scrollIntoView({behavior: 'smooth'})"
    }
  };
}

// Hiển thị thanh gợi ý câu hỏi nhanh (Quick-reply chips)
function renderQuickPrompts(containerId, isFloating = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const chipsHtml = QUICK_PROMPTS.map(p => `
    <button onclick="${isFloating ? `quickFillFloating('${p.query}')` : `quickFillPrompt('${p.query}')`}" 
      class="inline-block bg-white hover:bg-brand-50 text-stone-700 hover:text-brand-700 border border-stone-200 hover:border-brand-300 px-2.5 py-1 rounded-full text-[11px] font-medium transition shadow-xs whitespace-nowrap">
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

// Xử lý gửi tin nhắn ở Chatbot trên trang chính
function sendChatMessage() {
  const input = document.getElementById('userChatInput');
  const text = input.value.trim();
  if (!text) return;

  const container = document.getElementById('chatMessages');

  // 1. Hiển thị tin nhắn của người dùng
  const userDiv = document.createElement('div');
  userDiv.className = 'flex justify-end';
  userDiv.innerHTML = `<div class="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] leading-relaxed">${escapeHtml(text)}</div>`;
  container.appendChild(userDiv);
  input.value = '';
  container.scrollTop = container.scrollHeight;

  // 2. Hiển thị trạng thái "Bé Ba đang soạn tin nhắn..."
  const typingId = 'typing_' + Date.now();
  const typingDiv = document.createElement('div');
  typingDiv.id = typingId;
  typingDiv.className = 'flex items-start gap-2.5';
  typingDiv.innerHTML = `
    <div class="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs flex-shrink-0">AI</div>
    <div class="bg-stone-100 text-stone-500 py-2.5 px-4 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]"></span>
      <span class="ml-1 text-[11px] text-stone-400">Bé Ba đang tìm thông tin...</span>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  // 3. Trả lời sau 600ms
  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    const replyObj = getAiReplyAdvanced(text);

    let actionBtnHtml = '';
    if (replyObj.action) {
      actionBtnHtml = `
        <div class="mt-2.5 pt-2 border-t border-stone-200">
          <button onclick="${replyObj.action.onClick}" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-1.5 px-3 rounded-xl text-[11px] transition flex items-center justify-center gap-1 shadow-sm">
            <span>${replyObj.action.btnText}</span>
            <i class="ph-bold ph-arrow-right text-xs"></i>
          </button>
        </div>
      `;
    }

    const aiDiv = document.createElement('div');
    aiDiv.className = 'flex items-start gap-2.5';
    aiDiv.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs flex-shrink-0">AI</div>
      <div class="bg-stone-100 text-stone-800 p-3.5 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed shadow-xs">
        <div>${replyObj.text}</div>
        ${actionBtnHtml}
      </div>
    `;
    container.appendChild(aiDiv);
    container.scrollTop = container.scrollHeight;
  }, 650);
}

function quickFillPrompt(text) {
  const input = document.getElementById('userChatInput');
  if (input) {
    input.value = text;
    sendChatMessage();
  }
}

function quickFillFloating(text) {
  const input = document.getElementById('floatingInput');
  if (input) {
    input.value = text;
    sendFloatingMessage();
  }
}

// Floating Chat Widget
function toggleFloatingChat() {
  const win = document.getElementById('floatingChatWindow');
  if (win) {
    win.classList.toggle('hidden');
    // Khởi tạo thanh gợi ý trong popup nếu chưa có
    renderQuickPrompts('floatingQuickPrompts', true);
  }
}

function toggleChatbot() {
  const chatSection = document.getElementById('ai-consultant');
  if (chatSection) {
    chatSection.scrollIntoView({ behavior: 'smooth' });
    const input = document.getElementById('userChatInput');
    if (input) input.focus();
  }
}

function sendFloatingMessage() {
  const input = document.getElementById('floatingInput');
  const text = input.value.trim();
  if (!text) return;

  const container = document.getElementById('floatingChatMessages');
  const userDiv = document.createElement('div');
  userDiv.className = 'flex justify-end';
  userDiv.innerHTML = `<div class="bg-brand-600 text-white p-2.5 rounded-xl rounded-tr-none max-w-[80%]">${escapeHtml(text)}</div>`;
  container.appendChild(userDiv);
  input.value = '';
  container.scrollTop = container.scrollHeight;

  // Typing indicator
  const typingId = 'float_typing_' + Date.now();
  const typingDiv = document.createElement('div');
  typingDiv.id = typingId;
  typingDiv.className = 'flex items-start gap-1.5';
  typingDiv.innerHTML = `
    <div class="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] flex-shrink-0">AI</div>
    <div class="bg-stone-100 text-stone-400 p-2 rounded-xl rounded-tl-none text-[10px] flex items-center gap-1">
      <span class="w-1 h-1 rounded-full bg-brand-600 animate-ping"></span>
      <span>Đang trả lời...</span>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    const replyObj = getAiReplyAdvanced(text);

    let actionBtnHtml = '';
    if (replyObj.action) {
      actionBtnHtml = `
        <button onclick="${replyObj.action.onClick}" class="mt-2 w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-1 px-2 rounded-lg text-[10px] transition text-center block">
          ${replyObj.action.btnText} &rarr;
        </button>
      `;
    }

    const aiDiv = document.createElement('div');
    aiDiv.className = 'flex items-start gap-2';
    aiDiv.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] flex-shrink-0">AI</div>
      <div class="bg-stone-100 p-2.5 rounded-xl rounded-tl-none max-w-[85%] text-stone-700 leading-relaxed text-xs">
        <div>${replyObj.text}</div>
        ${actionBtnHtml}
      </div>
    `;
    container.appendChild(aiDiv);
    container.scrollTop = container.scrollHeight;
  }, 600);
}

// Tự động render thanh gợi ý khi tải trang
document.addEventListener('DOMContentLoaded', () => {
  renderQuickPrompts('chatQuickPrompts', false);
  renderQuickPrompts('floatingQuickPrompts', true);
});
