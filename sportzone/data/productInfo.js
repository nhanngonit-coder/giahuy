const APPAREL = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const SWATCH = [['Đen', '#111'], ['Trắng', '#f4f4f4'], ['Navy', '#1b2a4a'], ['Đỏ', '#e8112d'], ['Xanh lá', '#2e9e5b'], ['Hồng', '#f08fb0'], ['Xám', '#8a8d93']];
const SIZES = { giay: ['38', '39', '40', '41', '42', '43', '44'], 'quan-ao': APPAREL, 'doi-tuyen': APPAREL, pickleball: [] };
const SIZE_CHART = {
  giay: { head: ['Size (EU)', 'Chiều dài chân (cm)'], rows: [['38', '23.5'], ['39', '24.0'], ['40', '25.0'], ['41', '25.5'], ['42', '26.5'], ['43', '27.0'], ['44', '27.5']] },
  apparel: { head: ['Size', 'Chiều cao (cm)', 'Cân nặng (kg)'], rows: [['S', '160–165', '52–58'], ['M', '165–170', '58–65'], ['L', '170–175', '65–72'], ['XL', '175–180', '72–80'], ['2XL', '180–185', '80–88'], ['3XL', '185–190', '88–95']] },
};
const INFO = {
  giay: { mat: 'Thân lưới thoáng khí, đế EVA',
    desc: ['Đôi giày cân bằng giữa độ nhẹ và độ êm, phù hợp cả luyện tập hằng ngày lẫn thi đấu.'],
    hl: ['Thân giày lưới dệt thoáng khí, hạn chế bí nóng khi vận động dài.', 'Đế giữa EVA đàn hồi, êm chân ở từng bước.', 'Đế ngoài cao su có rãnh bám, vững trên nhiều bề mặt.'] },
  'quan-ao': { mat: '92% polyester, 8% spandex',
    desc: ['Thiết kế thể thao gọn gàng, dễ mặc từ sân tập đến đi chơi.', 'Vải mềm mịn, thoát ẩm nhanh và co giãn đa chiều nên không gò bó khi vận động.'],
    hl: ['Thoát ẩm nhanh, khô thoáng.', 'Co giãn đa chiều, đứng form.', 'Giữ màu tốt sau nhiều lần giặt.'] },
  pickleball: { mat: 'Sợi carbon, lõi polymer',
    desc: ['Thiết bị pickleball cho người mới lẫn người chơi lâu năm, tối ưu cảm giác bóng và khả năng kiểm soát.'],
    hl: ['Bề mặt tạo xoáy tốt.', 'Cân bằng giữa lực đánh và kiểm soát.', 'Bền, ít chấn động truyền lên tay.'] },
  'doi-tuyen': { mat: '100% polyester',
    desc: ['Trang phục lấy cảm hứng từ đội tuyển, đủ nhẹ để thi đấu và đủ đẹp để mặc ra đường cổ vũ.'],
    hl: ['Vải nhẹ, thoát mồ hôi nhanh.', 'Họa tiết và logo in sắc nét, bền màu.', 'Phom thoải mái cho cả mặc thi đấu lẫn mặc hằng ngày.'] },
};
const TINT = ['#f4f4f5', '#fdecef', '#e9f1ff', '#eaf7ee'];

module.exports = { SWATCH, SIZES, SIZE_CHART, INFO, TINT };