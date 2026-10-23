// Dữ liệu mẫu để nạp vào database lần chạy đầu tiên (xem db/seed.js).
const CATS = [
  { slug: 'giay', name: 'Giày', icon: '👟', k: 'Chạy bền, bước xa', c: ['#e63950', '#8f1d33'] },
  { slug: 'quan-ao', name: 'Quần áo', icon: '👕', k: 'Thoáng nhẹ cho mọi trận đấu', c: ['#1f5fbf', '#0c1b2e'] },
  { slug: 'pickleball', name: 'Pickleball', icon: '🏓', k: 'Sân mới, vợt mới', c: ['#16a085', '#0b4f47'] },
  { slug: 'doi-tuyen', name: 'Đội tuyển', icon: '⚽', k: 'Mặc áo, ghi dấu', c: ['#f26a2e', '#8f2b12'] },
];
const NAMES = {
  giay: ['Giày chạy bộ Cloud', 'Giày đá bóng Kumo', 'Giày pickleball Vortex', 'Giày thể thao Vento'],
  'quan-ao': ['Áo polo Flame', 'Áo phông Pixel', 'Quần short Flex', 'Váy thể thao Serena'],
  pickleball: ['Vợt Solus Core', 'Vợt Solus Prime', 'Bóng pickleball Pro', 'Túi đựng vợt'],
  'doi-tuyen': ['Áo CLB Hà Nội', 'Bộ thi đấu Nam Định', 'Áo đội tuyển quốc gia', 'Bộ suvec Olympic'],
};
// Thêm trường img: '/ten-anh.jpg' (đặt trong public/) vào sản phẩm để hiện ảnh thật thay cho emoji.
const PRODUCTS = []; let nid = 1;
for (const c of CATS) for (let r = 1; r <= 3; r++) NAMES[c.slug].forEach((n, i) => {
  const id = nid++;
  PRODUCTS.push({ id, base: `${c.slug}-${i + 1}`, cat: c.slug, name: r === 1 ? n : `${n} v${r}`, price: (250 + ((i * 7 + r * 13) % 40) * 30) * 1000, sale: (i + r) % 3 === 0 ? 15 : 0, out: id % 7 === 0 });
});
// Nội dung: chuỗi = đoạn văn, mảng = danh sách gạch đầu dòng, { h } = tiêu đề nhỏ.
const NEWS = [
  { slug: 'chon-vot-pickleball', t: 'Chọn vợt pickleball phù hợp lối chơi', d: '19/10/2026', c: ['#16a085', '#0b4f47'],
    s: 'Trọng lượng, chất liệu mặt vợt và độ dày lõi quyết định cảm giác đánh. Chọn đúng sẽ chơi bền và đỡ chấn thương.',
    body: [
      'Pickleball dễ làm quen, nhưng một cây vợt không hợp tay sẽ khiến bạn nhanh mỏi cổ tay và khó kiểm soát bóng.',
      { h: 'Trọng lượng vợt' },
      ['Vợt nhẹ (dưới 7.5 oz): linh hoạt, phản xạ nhanh, hợp người chơi dồn, đập lưới.', 'Vợt trung bình (7.5 – 8.2 oz): cân bằng giữa lực và kiểm soát, phù hợp đa số người mới.', 'Vợt nặng (trên 8.2 oz): nhiều lực hơn nhưng dễ mỏi tay.'],
      { h: 'Chất liệu mặt vợt' },
      'Mặt carbon cho độ xoáy và kiểm soát tốt hơn, mặt sợi thủy tinh cho lực đánh mạnh và giá mềm hơn.',
      { h: 'Độ dày lõi' },
      'Lõi 16mm cho cảm giác êm, dễ kiểm soát. Lõi 13 – 14mm cho cảm giác đầm, bóng đi nhanh và nhiều lực hơn.',
      'Nếu chưa chắc, hãy bắt đầu với vợt trung bình lõi 16mm rồi điều chỉnh theo lối chơi của mình.'] },
  { slug: 'chon-giay-chay-bo', t: 'Bí quyết chọn giày chạy bộ cho người mới', d: '12/10/2026', c: ['#e63950', '#8f1d33'],
    s: 'Đừng chọn giày chỉ vì đẹp. Hãy xem form chân, độ đệm và quãng đường bạn định chạy.',
    body: [
      'Một đôi giày phù hợp giúp bạn chạy xa hơn, ít đau gối và đau cổ chân hơn.',
      { h: 'Đo chân vào buổi chiều' },
      'Chân hơi nở về cuối ngày, nên thử giày lúc này sẽ sát thực tế nhất. Chừa khoảng một ngón tay giữa mũi chân và đầu giày.',
      { h: 'Chọn độ đệm theo quãng đường' },
      ['Chạy dưới 5 km: đệm vừa, ưu tiên nhẹ.', 'Chạy 5 – 10 km: đệm êm, đế đủ bám.', 'Chạy dài hoặc cân nặng lớn: đệm dày, hỗ trợ gót tốt.'],
      { h: 'Thay giày đúng lúc' },
      'Sau khoảng 500 – 800 km, độ đệm giảm rõ rệt. Nếu thấy mỏi chân bất thường, hãy kiểm tra lại đế giày.'] },
  { slug: 'mac-gi-khi-da-bong', t: 'Mặc gì khi đá bóng ngày nóng?', d: '07/10/2026', c: ['#f26a2e', '#8f2b12'],
    s: 'Vải thoáng, nhanh khô và màu sáng giúp bạn giữ thể lực suốt trận.',
    body: [
      'Trời nóng, cơ thể mất nước rất nhanh. Trang phục đúng sẽ giúp bạn đỡ mệt và tập trung hơn.',
      { h: 'Chọn vải' },
      'Ưu tiên polyester thoáng khí hoặc vải lưới, thấm hút và khô nhanh. Tránh cotton dày vì giữ mồ hôi, nặng và bí.',
      { h: 'Chọn màu' },
      'Màu sáng phản xạ nhiệt tốt hơn màu tối, nhất là khi đá sân ngoài trời buổi trưa.',
      { h: 'Phụ kiện nên có' },
      ['Tất thể thao có đệm gót, thấm mồ hôi.', 'Bó gối hoặc băng cổ chân nếu từng chấn thương.', 'Bình nước riêng, uống từng ngụm nhỏ đều đặn.']] },
  { slug: 'cham-soc-ao-thi-dau', t: 'Chăm sóc áo thi đấu đúng cách', d: '25/09/2026', c: ['#1f5fbf', '#0c1b2e'],
    s: 'Giặt đúng cách giúp áo giữ màu, giữ form và bền hơn nhiều mùa giải.',
    body: [
      'Áo thi đấu thường có lớp in và vải kỹ thuật nên cần được chăm sóc nhẹ nhàng hơn áo thường.',
      ['Lộn trái áo trước khi giặt để bảo vệ lớp in.', 'Giặt nước lạnh hoặc nước ấm dưới 30°C, chế độ nhẹ.', 'Không dùng thuốc tẩy và hạn chế nước xả vải vì làm giảm khả năng thấm hút.', 'Phơi nơi thoáng mát, tránh nắng gắt; không sấy nhiệt cao.', 'Không ủi trực tiếp lên phần in hoặc logo.'],
      'Giặt ngay sau trận nếu có thể. Để áo ướt lâu trong túi sẽ gây mùi khó chịu và ố vải.'] },
];

module.exports = { CATS, NEWS, PRODUCTS };