# SportZone

Web bán đồ thể thao theo mô hình **MVC** (Express): sản phẩm, phân trang (10 sản phẩm/trang), blog, chính sách, liên hệ, đăng ký nhận ưu đãi.
Dữ liệu lưu trong **SQLite**, đăng ký / đăng nhập bằng **Firebase Authentication** (Email-Mật khẩu + Google), gửi mail bằng Nodemailer.

## Chạy thử
1. `npm install`
2. `cp .env.example .env` rồi điền giá trị (xem dưới)
3. `npm start` (hoặc `npm run dev` để tự reload) -> mở http://localhost:3000

Lần chạy đầu tiên, database `data/sportzone.db` tự tạo và nạp dữ liệu mẫu (danh mục, sản phẩm, bài viết). Muốn nạp lại từ đầu: dừng server, xóa file `data/sportzone.db*`, chạy lại.

## Cấu hình Firebase
1. Firebase Console -> tạo project -> **Build -> Authentication -> Get started**, bật provider **Email/Password** và **Google**.
2. **Authentication -> Settings -> Authorized domains**: thêm domain khi deploy (`localhost` có sẵn).
3. **Project settings -> General -> Your apps -> Web app**: chép `apiKey`, `authDomain`, `projectId`, `appId` vào `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID` trong `.env`.
4. **Project settings -> Service accounts -> Generate new private key**: lưu file thành `serviceAccountKey.json` ở thư mục gốc, đặt `FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json`. **Không commit file này** (đã có trong `.gitignore`). Khi chạy trên GCP có thể bỏ trống để dùng Application Default Credentials.

Luồng đăng nhập: trình duyệt đăng nhập qua Firebase SDK -> gửi ID token tới `POST /auth/session` -> server xác thực bằng Firebase Admin, lưu user vào bảng `users` (khóa là Firebase UID), tạo session cookie (`httpOnly`, 5 ngày). Lần đăng ký đầu tiên gửi mail chào mừng. Trang `/profile` (cần đăng nhập) cho xem thông tin tài khoản, đổi họ tên (cập nhật cả Firebase lẫn DB) và xem các tin nhắn đã gửi.

## Cấu hình gửi mail (Gmail)
- Bật xác minh 2 bước, tạo **App password** tại myaccount.google.com/apppasswords, điền vào `SMTP_PASS`.
- Mail gửi khi: (1) người dùng tạo tài khoản lần đầu (mail chào mừng), (2) gửi form Liên hệ hoặc đăng ký ưu đãi (mail về `MAIL_TO`). Nội dung cũng được lưu trong DB (`contacts`, `subscribers`), nên lỗi SMTP không làm mất dữ liệu.

## Cấu trúc (MVC)
```
server.js            khởi động server
app.js               middleware + gắn routes
routes/index.js      bản đồ URL -> controller
controllers/         xử lý request (có profileController: trang /profile cần đăng nhập): gọi model, chọn view
models/              truy vấn SQLite (product, category, news, user, subscriber, contact)
views/               hàm dựng HTML (layout, components, home, catalog, product, content, contact, auth)
middleware/auth.js   đọc session cookie Firebase -> req.user, nạp req.cats
config/              db.js (SQLite), firebase.js, mailer.js
db/                  schema.sql, seed.js
data/                seedData.js (dữ liệu mẫu), content.js (menu, banner, chính sách), productInfo.js
public/              style.css, js/auth.js (Firebase client), ảnh
```
