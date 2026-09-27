/**
 * DỮ LIỆU SẢN PHẨM & TRUY XUẤT NGUỒN GỐC - ĐẶC SẢN ĐỒNG NAI
 * File này dùng để quản lý: danh mục sản phẩm, cơ sở dữ liệu tem QR, và các gói combo AI.
 */

// Danh sách sản phẩm chủ lực
const PRODUCTS_DATA = [
  {
    id: "TT-POMELO",
    name: "Bưởi Đường Lá Cam Tân Triều",
    tag: "OCOP 4 Sao",
    origin: "Cù Lao Tân Triều - Vĩnh Cửu",
    price: 85000,
    unit: "/kg",
    description: "Được nuôi dưỡng bởi phù sa sông Đồng Nai, bưởi Tân Triều có vỏ màu xanh vàng khi chín, múi mọng không sượng, vị ngọt đượm thanh tao không đắng hậu.",
    specs: {
      weight: "1.2kg - 1.5kg / trái",
      brix: "12.5 - 13.5°",
      shelfLife: "Để thoáng 20-30 ngày"
    },
    traceId: "TAN-TRIEU-01"
  },
  {
    id: "XL-CASHEW",
    name: "Hạt Điều Lụa Rang Củi",
    tag: "Xuất Khẩu Loại A",
    origin: "Xuân Lộc - Định Quán",
    price: 165000,
    unit: "/hộp 500g",
    description: "Thu hoạch từ thủ phủ điều đất đỏ bazan Đồng Nai. Phương pháp rang củi truyền thống giữ trọn lớp vỏ lụa, vị giòn rụm béo ngậy tự nhiên không gắt dầu.",
    specs: {
      weight: "Hộp hút chân không 500g",
      grade: "Size W240 (Hạt cồ loại 1)",
      shelfLife: "12 tháng nguyên seal"
    },
    traceId: "CASHEW-02"
  },
  {
    id: "TP-ANNONA",
    name: "Mãng Cầu Dai Đồng Nai",
    tag: "Chuẩn VietGAP",
    origin: "Thạnh Phú - Vĩnh Cửu",
    price: 75000,
    unit: "/kg",
    description: "Thịt trái dai giòn, ít hạt, vị ngọt thanh tự nhiên và hương thơm quyến rũ. Vườn trồng theo tiêu chuẩn vi sinh hữu cơ, không dư lượng thuốc BVTV.",
    specs: {
      weight: "400g - 600g / trái",
      feature: "Múi dai dày, dễ bóc vỏ",
      shelfLife: "Thu hoạch tươi hàng tuần"
    },
    traceId: "CUSTARD-03"
  }
];

// Cơ sở dữ liệu tem mã QR truy xuất nguồn gốc
const TRACE_DATABASE = {
  'TAN-TRIEU-01': {
    code: 'ĐNAI-TT-2026-POMELO-09',
    productName: 'Bưởi Đường Lá Cam Tân Triều',
    owner: 'Nhà Vườn Bác Sáu (Cù Lao Tân Triều)',
    location: 'Xã Tân Bình, Huyện Vĩnh Cửu, Tỉnh Đồng Nai',
    standard: 'VietGAP No. ĐNAI-2026-VG99',
    harvestDate: '24/09/2026 - 05:30 Sáng (Hái lứa sương sớm)',
    brix: '13.2° Brix (Rất ngọt thanh)',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://dongnai-ocop.vn/trace/tan-trieu-batch-202609',
    timeline: [
      { time: '24/09/2026 - 05:30', desc: 'Thu hái thủ công, tuyển chọn từng quả đạt chuẩn độ đường.' },
      { time: '24/09/2026 - 09:00', desc: 'Lau sạch vi sinh, kiểm định trọng lượng và dán tem QR chống hàng giả.' }
    ]
  },
  'CASHEW-02': {
    code: 'ĐNAI-XL-2026-CASHEW-04',
    productName: 'Hạt Điều Lụa Rang Củi Xuân Lộc',
    owner: 'HTX Nông Nghiệp Dịch Vụ Xuân Lộc',
    location: 'Huyện Xuân Lộc, Tỉnh Đồng Nai (Vùng Đất Đỏ Bazan)',
    standard: 'HACCP & OCOP 4 Sao',
    harvestDate: 'Vụ mùa tháng 08/2026',
    brix: 'Rang củi truyền thống',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://dongnai-ocop.vn/trace/xuan-loc-cashew-2026',
    timeline: [
      { time: '15/08/2026', desc: 'Sàng lọc hạt cồ W240 đạt chuẩn xuất khẩu.' },
      { time: '18/08/2026', desc: 'Rang củi thủ công giữ lớp vỏ lụa và đóng gói hút chân không tiệt trùng.' }
    ]
  },
  'CUSTARD-03': {
    code: 'ĐNAI-TP-2026-ANNONA-12',
    productName: 'Mãng Cầu Dai Thạnh Phú',
    owner: 'Tổ Hợp Tác Mãng Cầu Thạnh Phú',
    location: 'Xã Thạnh Phú, Huyện Vĩnh Cửu, Tỉnh Đồng Nai',
    standard: 'Hữu Cơ Sinh Học (Organic)',
    harvestDate: '24/09/2026 - Hái tươi sáng sớm',
    brix: '14.5° Brix',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://dongnai-ocop.vn/trace/thanh-phu-annona-2026',
    timeline: [
      { time: '24/09/2026 - 06:00', desc: 'Kiểm tra độ chín, hái lúc trái vừa già chuẩn độ ngọt.' },
      { time: '24/09/2026 - 08:30', desc: 'Phân loại size 1 và đóng khay màng thở bảo quản tự nhiên.' }
    ]
  }
};

// Cấu hình AI Combo theo ngân sách
const AI_COMBO_PRESETS = {
  '300-500': {
    title: 'Combo "Hương Vị Đồng Nai Mộc Mạc"',
    desc: 'Gợi ý tối ưu: <strong>01 Bưởi Tân Triều tuyển chọn (1.3kg)</strong> + <strong>01 Hộp Hạt Điều Rang Củi 500g</strong>. Tươi ngon, thiết thực, giá cả phải chăng cho gia đình hoặc làm quà thăm bạn bè thân tình.',
    price: 275000,
    saving: 'Tiết kiệm 20k'
  },
  '500-1000': {
    title: 'Combo Quà Biếu "Đất Đồng Nai Sum Vầy" (Khuyên Dùng)',
    desc: 'Gợi ý sang trọng: <strong>02 Bưởi Đường Lá Cam loại 1</strong> cuống lá tươi xanh + <strong>02 Hộp Điều Lụa Rang Củi</strong> kèm túi quà kraft thẩm mỹ. Giữ được độ tươi tới 2-3 tuần, rất hợp gửi tặng đối tác hoặc người thân ở xa.',
    price: 620000,
    saving: 'Tiết kiệm 45k'
  },
  '1000-plus': {
    title: 'Đại Combo Thượng Hạng "Phù Sa Cù Lao VIP"',
    desc: 'Gợi ý cao cấp nhất: <strong>01 Thùng 04 Bưởi Da Xanh & Lá Cam Nhất Phẩm</strong> + <strong>02 Hộp Điều Cồ Rang Củi Vỏ Lụa W240</strong> + <strong>02kg Mãng Cầu Dai Hữu Cơ</strong>. Đóng thùng xốp bọc rơm cao cấp dán tem bảo chứng OCOP.',
    price: 1280000,
    saving: 'Tặng thiệp viết tay AI & Freeship toàn quốc'
  }
};
