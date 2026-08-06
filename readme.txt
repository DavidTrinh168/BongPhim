techstack:
Frontend (UI)	webclient	ReactJS (dùng JavaScript/JSX), Vite (bundler)
Backend (API)	server	    Node.js (Runtime), Express.js (Framework), TypeScript (Ngôn ngữ)
Database (DB)	server	    MongoDB + Mongoose
Styling	        webclient	Tailwind CSS hoặc SCSS/Module CSS (Tùy chọn)

Techs must be added for HSL:
- FFmpeg
- Mutler
- AWS S3 (or Supabase Storage / Cloudinary)
- Video.js or React-Player or Shaka Player

Key features:
- Watch history
- Payment
- Movies streaming
- CND: distribute high speed videos 


Advance features:
- Bảo mật & Bản quyền (DRM): Để ngăn người dùng dùng IDM tải phim hoặc quay màn hình, web phim lớn phải dùng công nghệ mã hóa DRM (như Widevine của Google hay FairPlay của Apple).

- Hệ thống tìm kiếm: Dùng Elasticsearch để khi người dùng gõ chữ "Hành động", hệ thống gợi ý ngay lập tức các phim liên quan chỉ trong vài miligiây.

- Real-time (Socket.io / WebSockets trong NestJS): Phục vụ cho tính năng "Xem chung" (Watch Party) - nhiều người ở nhiều nơi cùng xem một tập phim và chat với nhau theo mốc thời gian thực.