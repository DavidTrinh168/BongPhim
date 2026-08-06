import Movie, { type IMovie } from '../models/Movie.js'; // Import Model

// 1. Logic Service: Thêm phim mới
// Chấp nhận dữ liệu phim và trả về đối tượng đã lưu
export const createMovie = async (movieData: IMovie) => {
  // TẠI ĐÂY LÀ NƠI CHÚNG TA THỰC HIỆN LOGIC KINH DOANH TRƯỚC KHI GHI VÀO DB

  // Ví dụ Logic: Đảm bảo slug là duy nhất (logic đã có trong Model, nhưng có thể kiểm tra thêm ở đây)

  const newMovie = new Movie(movieData);
  const savedMovie = await newMovie.save();

  return savedMovie; // TRẢ VỀ DỮ LIỆU THUẦN
};

// 2. Logic Service: Lấy tất cả phim
export const findAllMovies = async () => {
  const movies = await Movie.find({});

  // Ví dụ Logic: Lọc, phân trang hoặc sắp xếp dữ liệu trước khi trả về
  // if (movies.length > 100) { /* logic phân trang */ }

  return movies; // TRẢ VỀ DỮ LIỆU THUẦN
};

export const findMovieById = async (id: string) => {
  const movie = await Movie.findById(id).populate('genres').populate('countries');
  return movie;
};

export const findMovieBySlug = async (slugPara: string) => {
  const movies = await Movie.findOne({ slug: slugPara }).populate('genres').populate('countries');

  // Ví dụ Logic: Lọc, phân trang hoặc sắp xếp dữ liệu trước khi trả về
  // if (movies.length > 100) { /* logic phân trang */ }

  return movies; // TRẢ VỀ DỮ LIỆU THUẦN
};

// 3. Logic Service: Cập nhật phim
export const updateMovie = async (id: string, movieData: Partial<IMovie>) => {
  const movies = await Movie.updateOne({ _id: id }, movieData);

  // Ví dụ Logic: Lọc, phân trang hoặc sắp xếp dữ liệu trước khi trả về
  // if (movies.length > 100) { /* logic phân trang */ }

  return movies; // TRẢ VỀ DỮ LIỆU THUẦN
};
