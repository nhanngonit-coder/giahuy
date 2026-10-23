// Đăng nhập / đăng ký bằng Firebase Auth (phía trình duyệt).
// Sau khi thành công: gửi ID token lên /auth/session để server đổi thành session cookie, rồi đăng xuất khỏi SDK phía client.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup,
  GoogleAuthProvider, updateProfile, sendPasswordResetEmail, signOut,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const $ = s => document.querySelector(s);
const cfg = JSON.parse($('#fbcfg').textContent);
const msg = (t, ok) => { const e = $('#authmsg'); e.textContent = t || ''; e.className = ok ? 'ok' : 'err'; e.hidden = !t; };

if (!cfg.apiKey) { msg('Chưa cấu hình Firebase.'); throw new Error('Firebase chưa cấu hình'); }
const auth = getAuth(initializeApp(cfg));
auth.languageCode = 'vi';

const ERR = {
  'auth/invalid-credential': 'Email hoặc mật khẩu không đúng.',
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/email-already-in-use': 'Email này đã được đăng ký.',
  'auth/weak-password': 'Mật khẩu cần ít nhất 6 ký tự.',
  'auth/too-many-requests': 'Thử quá nhiều lần, vui lòng đợi một lát rồi thử lại.',
  'auth/network-request-failed': 'Lỗi mạng, kiểm tra kết nối và thử lại.',
  'auth/popup-closed-by-user': '',
  'auth/cancelled-popup-request': '',
};
const fail = e => msg(e.code in ERR ? ERR[e.code] : 'Có lỗi xảy ra, vui lòng thử lại.');

// Chỉ cho chuyển về đường dẫn nội bộ.
const next = () => { const n = new URLSearchParams(location.search).get('next'); return n && n[0] === '/' && n[1] !== '/' ? n : '/'; };

async function finish(cred) {
  const idToken = await cred.user.getIdToken();
  const r = await fetch('/auth/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) });
  await signOut(auth);
  if (!r.ok) throw Object.assign(new Error('session'), { code: 'session' });
  location.href = next();
}
const run = (btn, fn) => async e => {
  e?.preventDefault(); msg('');
  btn.disabled = true;
  try { await fn(); } catch (x) { fail(x); } finally { btn.disabled = false; }
};

const login = $('#f-login'), reg = $('#f-reg');
if (login) login.onsubmit = run(login.querySelector('button'), () =>
  signInWithEmailAndPassword(auth, login.email.value.trim(), login.password.value).then(finish));
if (reg) reg.onsubmit = run(reg.querySelector('button'), async () => {
  const cred = await createUserWithEmailAndPassword(auth, reg.email.value.trim(), reg.password.value);
  await updateProfile(cred.user, { displayName: reg.name.value.trim() });
  await finish(cred);
});
$('#gbtn').onclick = run($('#gbtn'), () => signInWithPopup(auth, new GoogleAuthProvider()).then(finish));
const forgot = $('#forgot');
if (forgot) forgot.onclick = run(forgot, async () => {
  const email = login.email.value.trim();
  if (!email) return msg('Nhập email rồi bấm "Quên mật khẩu" lần nữa.');
  await sendPasswordResetEmail(auth, email);
  msg('Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.', true);
});
