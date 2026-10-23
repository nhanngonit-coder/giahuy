# HƯỚNG DẪN ĐƯA SPORTZONE LÊN VERCEL

1. Giải nén ZIP. Thư mục chứa `package.json` là thư mục gốc dự án.
2. Tạo repository GitHub **Private** và tải các file trong thư mục gốc lên. Không tải `.env`, `serviceAccountKey.json`, `node_modules`.
3. Trên Vercel chọn Add New > Project > Import repository. Root Directory là thư mục có `package.json`.
4. Project Settings > Environment Variables: thêm các biến từ `.env.example`, dùng giá trị thật của riêng bạn. Đặc biệt cần `DATABASE_URL`, cấu hình Firebase và thông số SMTP nếu bật email. Không dùng giá trị ví dụ.
5. PostgreSQL cần được tạo trước (ví dụ Neon/Supabase). Ứng dụng sẽ tạo các bảng theo `db/schema.sql` khi truy vấn lần đầu.
6. Deploy, mở URL `.vercel.app` bằng Chrome. Kiểm tra `/`, `/products`, `/cart`, `/checkout`, `/login`, `/admin` và `/admin/orders`.
7. Muốn cập nhật: sửa code, commit/push vào nhánh GitHub kết nối với Vercel. Vercel sẽ tự deploy.

LƯU Ý BẢO MẬT: ZIP nguồn ban đầu chứa file khóa bí mật và thư mục .git. Bản này đã loại bỏ. Nếu khóa đã được đăng tải, cần thay/thu hồi khóa trước khi chạy production.

Để vào trang quản trị, đăng nhập Google bằng email được khai báo trong `ADMIN_EMAILS`. Đơn hàng được thanh toán COD, chưa tích hợp cổng thanh toán trực tuyến.
