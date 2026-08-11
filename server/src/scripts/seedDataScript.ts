import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as readline from 'node:readline/promises'; // Thư viện để làm prompt hỏi đáp ở terminal
import { fakerVI as faker } from '@faker-js/faker';

// Import Models
import Movie from '../models/Movie.js';
import Country from '../models/Country.js';
import Genre from '../models/Genre.js';

import fakeMoviesData from './fakeMovieData.json' with { type: 'json' };

dotenv.config();

const connectDB = async () => {
  // 1. KIỂM TRA MÔI TRƯỜNG (BẢO MẬT QUAN TRỌNG)
  // Mặc định nếu không set, ta coi như là development
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production') {
    console.error('🚨 CẢNH BÁO ĐỎ: Bạn đang ở môi trường PRODUCTION!');
    console.error('Tuyệt đối không được chạy lệnh Seed này để tránh mất dữ liệu thực tế.');
    process.exit(1);
  }

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('❌ Lỗi: Chưa cấu hình MONGO_URI trong file .env');
    process.exit(1);
  }

  console.log(`🔄 Đang kết nối tới MongoDB (Môi trường: ${env})...`);
  await mongoose.connect(MONGO_URI, {
    autoIndex: false, // Chặn Mongoose tự mọc lại Collection trống
  });
  console.log('✅ Kết nối MongoDB thành công!');
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // DỌN DẸP DỮ LIỆU CŨ
    console.log('🧹 Đang xóa sạch dữ liệu Movies, Countries, Genres cũ...');
    await Promise.all([Movie.deleteMany({}), Country.deleteMany({}), Genre.deleteMany({})]);

    //TẠO DỮ LIỆU QUỐC GIA MẪU (Dành cho list phim của bạn)
    console.log('🌱 Đang nạp danh sách Quốc gia...');
    const createdCountries = await Country.insertMany([
      { name: 'Vietnam', viName: 'Việt Nam', slug: 'viet-nam', iso_3166_1: 'VN' },
      { name: 'United States', viName: 'Mỹ', slug: 'my', iso_3166_1: 'US' },
      { name: 'South Korea', viName: 'Hàn Quốc', slug: 'han-quoc', iso_3166_1: 'KR' },
    ]);

    // TẠO DỮ LIỆU THỂ LOẠI MẪU
    console.log('🌱 Đang nạp danh sách Thể loại...');
    const createdGenres = await Genre.insertMany([
      { name: 'Hành Động', slug: 'hanh-dong', description: 'Phim có nhịp độ nhanh' },
      { name: 'Tình Cảm', slug: 'tinh-cam', description: 'Phim lãng mạn' },
      { name: 'Hài Hước', slug: 'hai-huoc', description: 'Phim mang tính giải trí cao' },
      { name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong', description: 'Phim Sci-Fi' },
      { name: 'Tâm Lý', slug: 'tam-ly', description: 'Phim nặng về diễn biến nội tâm' },
    ]);

    // NẠP DỮ LIỆU PHIM THẬT TỪ FILE JSON
    console.log('🎬 Đang nạp dữ liệu phim thực tế...');

    // Xử lý nối Foreign Key (ID Quốc gia và Thể loại) vào từng bộ phim
    const moviesToInsert = fakeMoviesData.map((movie) => {
      // Dùng Faker bốc ngẫu nhiên 1 quốc gia và 1-2 thể loại cho mỗi phim
      const randomCountries = faker.helpers.arrayElements(createdCountries, 1).map((c) => c._id);

      const randomGenres = faker.helpers
        .arrayElements(createdGenres, { min: 1, max: 2 })
        .map((g) => g._id);

      return {
        ...movie,
        countries: randomCountries,
        genres: randomGenres,
        crew: [], // Mặc định rỗng nếu bạn chưa làm bảng Crew
      };
    });

    await Movie.insertMany(moviesToInsert);
    console.log(`🎉 XONG! Đã đổ thành công ${moviesToInsert.length} bộ phim vào Database.`);
  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error);
  } finally {
    //Ngắt kết nối sau khi xong việc
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối MongoDB.');
    process.exit(0);
  }
};

const deleteSeedDatabase = async () => {
  // Tạo interface để hỏi đáp trên Terminal
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let answer = '';

  try {
    while (true) {
      // Hiển thị câu hỏi màu vàng
      answer = await rl.question(
        '\x1b[33m⚠️ Bạn có CHẮC CHẮN muốn XÓA HOÀN TOÀN Database không? Hành động này không thể hoàn tác! (y/N): \x1b[0m',
      );

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        rl.close(); // Đóng giao diện hỏi đáp terminal
        await connectDB();
        console.log('🧨 Đang tiến hành hủy diệt Database...');

        await mongoose.connection.db?.dropDatabase();

        console.log('✅ Đã DROP toàn bộ Database thành công!');
        await mongoose.disconnect();
        console.log('🔌 Đã ngắt kết nối MongoDB.');

        break; // Thoát vòng lặp
      } else if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'no') {
        console.log('🛑 Đã hủy bỏ hành động DROP Database. Không có gì bị xóa.');
        rl.close(); // Đóng giao diện hỏi đáp terminal
        break;
      } else {
        console.log('❌ Lựa chọn không hợp lệ. Vui lòng nhập "y" hoặc "n".');
      }
    }
  } catch (error) {
    console.error('❌ Lỗi khi DROP Database:', error);
    process.exit(1);
  }
  process.exit(0);
};

// Đọc tham số truyền vào từ Terminal (ví dụ: tsx seedDataScript.ts drop)
const action = process.argv[2];

// Chạy hàm
if (action === 'drop') {
  deleteSeedDatabase();
} else {
  seedDatabase();
}
