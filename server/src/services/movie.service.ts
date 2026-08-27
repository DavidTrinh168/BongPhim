import Movie, { type IMovie } from '../models/Movie.js';
import Episode from '../models/Episode.js';
import WatchList from '../models/watchList.js';
import WatchHistory from '../models/watchHistory.js';

export const createMovie = async (movieData: IMovie) => {
  const newMovie = new Movie(movieData);
  const savedMovie = await newMovie.save();

  return savedMovie;
};

export const findAllMovies = async () => {
  const movies = await Movie.find({});
  // Ví dụ Logic: Lọc, phân trang hoặc sắp xếp dữ liệu trước khi trả về
  // if (movies.length > 100) { /* logic phân trang */ }
  return movies;
};

export const findAllPublicMovies = async () => {
  const movies = await Movie.find({is_active: true });

  // Ví dụ Logic: Lọc, phân trang hoặc sắp xếp dữ liệu trước khi trả về
  // if (movies.length > 100) { /* logic phân trang */ }
  return movies;
};

export const findMovieById = async (id: string) => {
  const movie = await Movie.findById(id).populate(['genres', 'countries', 'crew']);
  return movie;
};

// [PUBLIC] Tìm phim theo Slug cho User
export const findMovieBySlug = async (slugPara: string) => {
  const movie = await Movie.findOne({ slug: slugPara, is_active: true }) // - Bắt buộc phim phải đang hoạt động (is_active: true)
    .populate(['genres', 'countries', 'crew'])
    .select('-createdAt -updatedAt -__v'); // Ẩn các trường hệ thống không cần thiết với user
  return movie;
};

export const updateMovie = async (id: string, movieData: Partial<IMovie>) => {
  const movies = await Movie.updateOne({ _id: id }, movieData);
  return movies;
};

export const deleteMovieByID = async (id: string) => {
  const deletedovie = await Movie.findByIdAndDelete(id);

  //xóa mọi thứ liên quan đến phim đã xóa
  if (deletedovie) {
    await Promise.all([
      Episode.deleteMany({ movie_id: id }),
      WatchHistory.deleteMany({ movie_id: id }),
      //Lấy ID phim này ra khỏi tất cả các WatchList
      //$pull: Kéo (xóa) phim đó ra khỏi mảng
      //$push:
      //$set:
      WatchList.updateMany({ movies: id }, { $pull: { movies: id } }),
    ]);
  }

  return deletedovie;
};
