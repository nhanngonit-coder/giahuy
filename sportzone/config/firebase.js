const fs = require('fs');
const admin = require('firebase-admin');

const env = process.env;
// Cấu hình phía trình duyệt (không phải bí mật, được phép lộ ra HTML).
const clientConfig = {
  apiKey: env.FIREBASE_API_KEY, authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID, appId: env.FIREBASE_APP_ID,
};
const enabled = !!(clientConfig.apiKey && clientConfig.authDomain && clientConfig.projectId);

if (enabled) {
  const sa = env.FIREBASE_SERVICE_ACCOUNT;          // đường dẫn tới file JSON (chạy trên máy / Render)
  const json = env.FIREBASE_SERVICE_ACCOUNT_JSON;   // nội dung JSON dán thẳng vào biến môi trường (Vercel)
  admin.initializeApp(
    json
      ? { credential: admin.credential.cert(JSON.parse(json)) }
      : sa && fs.existsSync(sa)
        ? { credential: admin.credential.cert(JSON.parse(fs.readFileSync(sa, 'utf8'))) }
        : { credential: admin.credential.applicationDefault(), projectId: clientConfig.projectId }); // chạy trên GCP: dùng ADC
} else {
  console.warn('Chưa có FIREBASE_API_KEY / FIREBASE_AUTH_DOMAIN / FIREBASE_PROJECT_ID trong .env: đăng nhập đang tắt.');
}

module.exports = { enabled, clientConfig, auth: () => admin.auth() };