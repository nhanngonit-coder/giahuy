const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Product = require('../models/product');
const Order = require('../models/order');
const { money } = require('../utils/helpers');
const { notFound } = require('../views/layout');
const view = require('../views/shop');

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 587, secure: process.env.SMTP_PORT == 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const clampQty = v => Math.min(99, Math.max(1, parseInt(v) || 1));

// Nhận [{id,c,s,q}] từ trình duyệt, tính lại giá từ CSDL.
async function build(raw) {
  const list = (Array.isArray(raw) ? raw : []).slice(0, 50).map((x, idx) => ({
    idx, id: Number(x?.id), c: String(x?.c || '').slice(0, 40), s: String(x?.s || '').slice(0, 20), q: clampQty(x?.q),
  })).filter(x => Number.isInteger(x.id));
  const byId = new Map((await Product.findMany([...new Set(list.map(x => x.id))])).map(p => [p.id, p]));
  const lines = list.filter(x => byId.has(x.id)).map(x => {
    const p = byId.get(x.id), unit = Math.round(p.price * (100 - p.sale) / 100);
    return { ...x, p, unit, sum: unit * x.q };
  });
  return { lines, total: lines.filter(l => !l.p.out).reduce((s, l) => s + l.sum, 0) };
}

exports.cartPage = (req, res) => res.send(view.cart(req));
exports.checkoutPage = (req, res) => res.send(view.checkout(req));

exports.apiCart = async (req, res) => {
  const { lines, total } = await build(req.body?.items);
  res.json({ keep: lines.map(l => l.idx), html: view.cartBox(lines, total), mini: view.mini(lines, total) });
};

// Chống gửi đơn dồn dập: tối đa 5 đơn / 10 phút cho mỗi IP.
// Lưu ý: bộ đếm nằm trong RAM nên chỉ có tác dụng đầy đủ khi chạy 1 tiến trình (Render). Trên Vercel mỗi instance đếm riêng.
const hits = new Map();
const limited = ip => {
  const now = Date.now(), a = (hits.get(ip) || []).filter(t => now - t < 600000);
  a.push(now); hits.set(ip, a);
  return a.length > 5;
};

exports.apiCheckout = async (req, res) => {
  if (limited(req.ip)) return res.status(429).json({ error: 'Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.' });
  const b = req.body || {};
  const name = String(b.name || '').trim().slice(0, 80), phone = String(b.phone || '').trim();
  const address = String(b.address || '').trim().slice(0, 200), note = String(b.note || '').trim().slice(0, 300);
  if (!name || !/^(\+84|0)[0-9\s.-]{8,12}$/.test(phone) || address.length < 8)
    return res.status(400).json({ error: 'Vui lòng nhập đủ họ tên, số điện thoại hợp lệ và địa chỉ nhận hàng.' });

  try {
    const ok = (await build(b.items)).lines.filter(l => !l.p.out);
    if (!ok.length) return res.status(400).json({ error: 'Giỏ hàng trống hoặc sản phẩm đã hết hàng.' });

    const items = ok.map(l => ({ id: l.p.id, name: l.p.name, c: l.c, s: l.s, q: l.q, unit: l.unit }));
    const total = ok.reduce((s, l) => s + l.sum, 0);
    const code = crypto.randomBytes(5).toString('hex').toUpperCase();
    await Order.create({ code, userUid: req.user?.uid, name, phone, address, note, items, total });

    await mailer.sendMail({
      from: `"SportZone" <${process.env.SMTP_USER}>`, to: process.env.MAIL_TO || process.env.SMTP_USER,
      replyTo: req.user?.email || undefined, subject: `Đơn hàng mới #${code}`,
      text: `Khách: ${name}\nĐT: ${phone}\nĐịa chỉ: ${address}\nGhi chú: ${note}\n\n` +
        items.map(i => `- ${i.name} (${[i.c, i.s && 'size ' + i.s].filter(Boolean).join(', ')}) x${i.q}: ${money(i.unit * i.q)}`).join('\n') +
        `\n\nTổng: ${money(total)} (thanh toán khi nhận hàng)`,
    }).catch(e => console.error('Gửi mail đơn hàng lỗi:', e.message));

    res.json({ code });
  } catch (e) {
    console.error('Tạo đơn hàng lỗi:', e.message);
    res.status(500).json({ error: 'Không thể tạo đơn hàng lúc này, vui lòng thử lại.' });
  }
};

exports.successPage = async (req, res) => {
  const o = await Order.byCode(String(req.params.code).toUpperCase());
  if (!o) return res.status(404).send(notFound(req, 'Không tìm thấy đơn hàng', '/', 'Về trang chủ'));
  res.send(view.success(req, o));
};
