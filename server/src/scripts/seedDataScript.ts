import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as readline from 'node:readline/promises'; // Thư viện để làm prompt hỏi đáp ở terminal
import { fakerVI as faker } from '@faker-js/faker';

// Import Models
import Movie from '../models/Movie.js';
import Country from '../models/Country.js';
import Genre from '../models/Genre.js';
import User from '../models/User.js';
import Crew from '../models/Crew.js';

import baseMoviesData from './baseMovieData.json' with { type: 'json' };
import fakeUsersData from './fakeUserData.json' with { type: 'json' };
import baseCrewData from './baseCrewData.json' with { type: 'json' };
import baseCountryData from './baseCountryData.json' with { type: 'json' };
import baseGenreData from './baseGenreData.json' with { type: 'json' };

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
    console.log('🧹 Đang xóa sạch dữ liệu cũ...');
    await Promise.all([
      Movie.deleteMany({}),
      Country.deleteMany({}),
      Genre.deleteMany({}),
      User.deleteMany({}),
      Crew.deleteMany({}),
    ]);

    console.log('🌱 Đang nạp danh sách Quốc gia...');
    const createdCountries = await Country.insertMany(baseCountryData);
    console.log(`🎉 Đã đổ thành công ${createdCountries.length} quốc gia vào Database.`);

    console.log('🌱 Đang nạp danh sách Thể loại...');
    const createdGenres = await Genre.insertMany(baseGenreData);
    console.log(`🎉 Đã đổ thành công ${createdGenres.length} thể loại vào Database.`);

    console.log('🌱 Đang nạp danh sách diễn viên...');
    const createdCrew = await Crew.insertMany(baseCrewData);
    console.log(`🎉 Đã đổ thành công ${createdCrew.length} diễn viên vào Database.`);

    console.log('🎬 Đang nạp dữ liệu phim thực tế...');
    // Xử lý nối Foreign Key (ID Quốc gia và Thể loại) vào từng bộ phim
    const moviesToInsert = baseMoviesData.map((movie) => {
      // Dùng Faker bốc ngẫu nhiên 1 quốc gia và 1-2 thể loại cho mỗi phim
      const randomCountries = faker.helpers.arrayElements(createdCountries, 1).map((c) => c._id);
      const randomGenres = faker.helpers.arrayElements(createdGenres, { min: 1, max: 2 }).map((g) => g._id);
      const randomCrew = faker.helpers.arrayElements(createdCrew, { min: 1, max: 2 }).map((g) => g._id);

      return {...movie,
        countries: randomCountries,
        genres: randomGenres,
        crew: randomCrew, 
      };
    });

    const insertedMovies = await Movie.insertMany(moviesToInsert); // Hứng mảng phim vừa tạo để lấy _id
    console.log(`🎉 Đã đổ thành công ${insertedMovies.length} bộ phim vào Database.`);

    // // Lấy ra danh sách các ID phim vừa tạo
    // const movieIds = insertedMovies.map(m => m._id);

    // NẠP DỮ LIỆU NGƯỜI DÙNG (USERS)
    console.log('👤 Đang nạp dữ liệu người dùng...');
    const insertedUsers = await User.insertMany(fakeUsersData);
    console.log(`🎉 Đã đổ thành công ${insertedUsers.length} tài khoản người dùng vào Database.`);

    console.log('✨ QUÁ TRÌNH SEED DỮ LIỆU HOÀN TẤT THÀNH CÔNG! ✨');
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
        while (true) {
          let cfAnswer = '';
          cfAnswer = await rl.question('\x1b[33m⚠️ Bạn hãy gõ lại BongPhim để xác nhận: \x1b[0m');
          if (cfAnswer === 'BongPhim') {
            rl.close(); // Đóng giao diện hỏi đáp terminal
            await connectDB();
            console.log('🧨 Đang tiến hành hủy diệt Database...');
            await mongoose.connection.db?.dropDatabase();
            console.log('✅ Đã DROP toàn bộ Database thành công!');
            await mongoose.disconnect();
            console.log('🔌 Đã ngắt kết nối MongoDB.');
            break; // Thoát vòng lặp
          }
        }
        break;
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
