import type { Request, Response } from 'express';
import * as movieService from '../services/movie.service.js';
import { isValidObjectId } from 'mongoose';

export const createrMovie = async (req: Request, res: Response) => {
  try {
    const movieData = req.body;

    const savedMovie = await movieService.createMovie(movieData);

    res.status(201).json({
      message: 'Movie or Series added successfully',
      data: savedMovie,
    });
  } catch (error) {
    if (error && (error as any).code === 11000) {
      return res.status(409).json({ message: 'Title or Slug already exists.' });
    }
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await movieService.findAllMovies();
    // logic phân trang
    res.status(200).json({
      message: 'Movies retrieved successfully',
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
export const getPublicMovies = async (req: Request, res: Response) => {
  try {
    const movies = await movieService.findAllPublicMovies();

    res.status(200).json({
      message: 'Movies retrieved successfully',
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPublicMovieDetail = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (typeof slug !== 'string') {
      return res.status(400).json({
        status: 'fail',
        message: 'Slug không hợp lệ',
      });
    }

    const movie = await movieService.findMovieBySlug(slug);

    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy bộ phim này',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: movie,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getMovieDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string' || !isValidObjectId(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Movie ID không hợp lệ',
      });
    }

    const movie = await movieService.findMovieById(id);

    if (!movie)
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy bộ phim này',
      });

    return res.status(200).json({
      status: 'success',
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  } 
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    //Chống lỗi TypeScript (Kiểm tra xem tính hợp lệ của movieId)
    if (typeof id !== 'string' || !isValidObjectId(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'movieId không hợp lệ',
      });
    }

    const deletedMMovie = await movieService.deleteMovieByID(id);

    //vì delete thành công sẽ return lại thông tin movie đã xóa nên kiểm tra
    if (!deletedMMovie) {
      return res.status(400).json({
        status: 'fail',
        message: 'Không tìm thấy bộ phim này hoặc đã bị xóa',
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
