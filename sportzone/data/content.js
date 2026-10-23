const { Q } = require('../utils/helpers');

const BANNERS = {
  products: { k: 'Bộ sưu tập mới', t: 'Tất cả sản phẩm', g: 'Shop', c: ['#2b2f3a', '#0c1b2e'] },
  contact: { k: 'Chúng tôi luôn sẵn sàng', t: 'Liên hệ', g: 'Chat', c: ['#e8112d', '#7a0a1a'] },
};
const SLIDES = [
  { k: 'Trang phục thi đấu', t: 'Đội tuyển bóng đá', g: 'Việt Nam', b: '/category/doi-tuyen', c: ['#f26a2e', '#b8391b', '#1d0f0c'], j: ['#d62828', '#4aa3df', '#ffffff', '#e11d2e', '#7a1230'] },
  { k: 'Bộ sưu tập mới', t: 'Sân pickleball', g: 'Chất riêng', b: '/category/pickleball', c: ['#2f7de1', '#1b4aa0', '#0c1b2e'], j: ['#ff7a1a', '#ffffff', '#1f5fbf', '#ffd23f', '#0c1b2e'] },
  { k: 'Chạy bền, bước xa', t: 'Giày thể thao', g: 'Nhẹ như mây', b: '/category/giay', c: ['#e63950', '#8f1d33', '#1a0a10'], j: ['#ffffff', '#0c1b2e', '#f5c542', '#ffffff', '#2b2b2b'] },
];
const TRIO = [
  { k: 'Pickleball', t: 'Vợt Solus', b: '/category/pickleball', c: ['#16a085', '#0b4f47'] },
  { k: 'Thoáng nhẹ', t: 'Quần áo', b: '/category/quan-ao', c: ['#1f5fbf', '#0c1b2e'] },
  { k: 'Nhẹ như mây', t: 'Giày Vento', b: Q('vento'), c: ['#e63950', '#8f1d33'] },
];
const POLICIES = {
  'mua-hang': { title: 'Chính sách mua hàng', sec: [
    { h: 'Cách đặt hàng' },
    'Bạn có thể xem sản phẩm trên website, sau đó liên hệ SportZone qua trang Liên hệ hoặc hotline 1800 0000 để được tư vấn size và chốt đơn.',
    { h: 'Giá và thanh toán' },
    ['Giá niêm yết đã bao gồm thuế VAT.', 'Thanh toán khi nhận hàng (COD) tại nhà.', 'Có thể thanh toán chuyển khoản theo hướng dẫn của nhân viên.'],
    { h: 'Vận chuyển' },
    ['Giao hàng toàn quốc qua đơn vị vận chuyển đối tác.', 'Nội thành: 1 – 2 ngày làm việc. Tỉnh thành khác: 2 – 5 ngày làm việc.', 'Bạn được kiểm tra hàng trước khi thanh toán.'],
    { h: 'Xác nhận đơn hàng' },
    'Sau khi đặt, nhân viên sẽ liên hệ xác nhận thông tin, tình trạng hàng và thời gian giao dự kiến.'] },
  'doi-tra': { title: 'Chính sách đổi trả', sec: [
    { h: 'Thời gian đổi trả' },
    'Trong vòng 7 ngày kể từ ngày nhận hàng.',
    { h: 'Điều kiện áp dụng' },
    ['Sản phẩm còn nguyên tem, mác, chưa giặt, chưa qua sử dụng.', 'Còn đầy đủ hộp, phụ kiện và hóa đơn hoặc thông tin đơn hàng.', 'Sản phẩm bị lỗi do nhà sản xuất hoặc giao sai mẫu, sai size.'],
    { h: 'Trường hợp không áp dụng' },
    ['Sản phẩm đã qua sử dụng, giặt hoặc có dấu hiệu hư hỏng do người dùng.', 'Sản phẩm giảm giá đặc biệt hoặc thanh lý (nếu có ghi chú rõ khi bán).'],
    { h: 'Quy trình' },
    ['Liên hệ SportZone qua hotline hoặc email info@sportzone.vn, nêu mã đơn và lý do.', 'Gửi lại sản phẩm theo hướng dẫn.', 'Chúng tôi kiểm tra và đổi sản phẩm mới hoặc hoàn tiền trong 3 – 5 ngày làm việc.'],
    'Với lỗi từ phía SportZone, chúng tôi chịu phí vận chuyển hai chiều.'] },
  'bao-hanh': { title: 'Chính sách bảo hành', sec: [
    { h: 'Phạm vi bảo hành' },
    ['Giày: bảo hành 3 tháng với lỗi bong keo, đứt chỉ, hở đế.', 'Vợt pickleball: bảo hành 6 tháng với lỗi bong tách mặt vợt, nứt lõi do sản xuất.', 'Quần áo và trang phục: hỗ trợ xử lý lỗi đường may, khóa kéo trong 30 ngày.'],
    { h: 'Không thuộc phạm vi bảo hành' },
    ['Hao mòn tự nhiên khi sử dụng.', 'Hư hỏng do va đập mạnh, dùng sai mục đích hoặc bảo quản không đúng cách.', 'Sản phẩm đã bị tự ý sửa chữa.'],
    { h: 'Cách yêu cầu bảo hành' },
    'Liên hệ SportZone kèm hình ảnh sản phẩm lỗi và thông tin đơn hàng. Thời gian xử lý thông thường từ 5 – 10 ngày làm việc tùy mức độ lỗi.'] },
  'bao-mat': { title: 'Chính sách bảo mật', sec: [
    { h: 'Thông tin chúng tôi thu thập' },
    ['Họ tên, email và nội dung bạn gửi qua form liên hệ.', 'Email bạn đăng ký nhận ưu đãi.', 'Tên, email và ảnh đại diện khi bạn đăng nhập bằng Google.'],
    { h: 'Mục đích sử dụng' },
    ['Phản hồi yêu cầu và hỗ trợ đơn hàng.', 'Gửi thông tin ưu đãi nếu bạn đã đăng ký.', 'Cải thiện trải nghiệm sử dụng website.'],
    { h: 'Chia sẻ thông tin' },
    'SportZone không bán hoặc trao đổi thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ với đơn vị vận chuyển khi cần giao hàng, hoặc khi pháp luật yêu cầu.',
    { h: 'Bảo mật và quyền của bạn' },
    'Chúng tôi áp dụng các biện pháp hợp lý để bảo vệ dữ liệu. Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bằng cách gửi email tới info@sportzone.vn.'] },
};
const MENU = [
  { t: 'Đồ nam', h: '/collection/nam', g: [
    { t: 'Giày', h: '/category/giay', i: [['Giày đá bóng', Q('đá bóng')], ['Giày pickleball', Q('pickleball')], ['Giày chạy bộ', Q('chạy bộ')]] },
    { t: 'Quần áo', h: '/category/quan-ao', i: [['Áo polo', Q('polo')], ['Áo phông', Q('phông')], ['Quần short', Q('short')]] }] },
  { t: 'Đồ nữ', h: '/collection/nu', g: [
    { t: 'Giày', h: '/category/giay', i: [['Giày chạy bộ', Q('chạy bộ')], ['Giày thể thao', Q('thể thao')], ['Giày pickleball', Q('pickleball')]] },
    { t: 'Quần áo', h: '/category/quan-ao', i: [['Áo polo', Q('polo')], ['Váy thể thao', Q('váy')]] }] },
  { t: 'Môn thể thao', h: '/collection/mon-the-thao', g: [
    { t: 'Bóng đá', h: '/category/doi-tuyen', i: [['Trang phục', '/category/doi-tuyen'], ['Giày', Q('đá bóng')]] },
    { t: 'Pickleball', h: '/category/pickleball', i: [['Vợt', Q('vợt')], ['Giày', Q('pickleball')], ['Phụ kiện', Q('túi')]] }] },
  { t: 'Đội tuyển', h: '/category/doi-tuyen' },
  { t: 'Blog', h: '/blog' },
];
const COLLECTIONS = {
  nam: { name: 'Đồ nam', cats: ['giay', 'quan-ao'], skip: /váy/i, slides: [
    { k: 'Bộ sưu tập nam', t: 'Đồ nam', g: 'Mạnh mẽ', b: '/category/quan-ao', c: ['#1f5fbf', '#123a7a', '#0c1b2e'], j: ['#0c1b2e', '#ffffff', '#1f5fbf', '#f5c542', '#2b2b2b'] },
    { k: 'Chạy bền, bước xa', t: 'Giày nam', g: 'Vững bước', b: '/category/giay', c: ['#e63950', '#8f1d33', '#1a0a10'], j: ['#ffffff', '#0c1b2e', '#e63950', '#ffffff', '#2b2b2b'] }] },
  nu: { name: 'Đồ nữ', cats: ['giay', 'quan-ao'], slides: [
    { k: 'Bộ sưu tập nữ', t: 'Đồ nữ', g: 'Năng động', b: '/category/quan-ao', c: ['#e0508f', '#8f1d5a', '#2a0a1d'], j: ['#ffffff', '#f7a8c9', '#e0508f', '#ffd23f', '#2b2b2b'] },
    { k: 'Thoáng nhẹ', t: 'Váy thể thao', g: 'Serena', b: Q('váy'), c: ['#8e5bd6', '#4b2a8a', '#150a2e'], j: ['#ffffff', '#c9a8f7', '#8e5bd6', '#f5c542', '#2b2b2b'] }] },
  'mon-the-thao': { name: 'Môn thể thao', cats: ['doi-tuyen', 'pickleball'], slides: [
    { k: 'Trang phục thi đấu', t: 'Bóng đá', g: 'Hết mình', b: '/category/doi-tuyen', c: ['#f26a2e', '#b8391b', '#1d0f0c'], j: ['#d62828', '#4aa3df', '#ffffff', '#e11d2e', '#7a1230'] },
    { k: 'Bộ sưu tập mới', t: 'Pickleball', g: 'Chất riêng', b: '/category/pickleball', c: ['#16a085', '#0b4f47', '#04201d'], j: ['#ff7a1a', '#ffffff', '#16a085', '#ffd23f', '#0c1b2e'] }] },
};

module.exports = { BANNERS, SLIDES, TRIO, POLICIES, MENU, COLLECTIONS };