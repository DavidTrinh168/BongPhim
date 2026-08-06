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

    res.status(200).json({
      message: 'Movies retrieved successfully',
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMovieDetail = async (req: Request, res: Response) => {
  try {
    // Gọi chung là identifier (có thể là slug hoặc id)
    const { identifier } = req.params; 

    //Chống lỗi TypeScript (Kiểm tra xem identifier có phải là chuỗi hợp lệ không)
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({
        status: 'fail',
        message: 'Identifier không hợp lệ',
      });
    }

    let movie;

    if (isValidObjectId(identifier)) {
      movie = await movieService.findMovieById(identifier);
    } else {
      movie = await movieService.findMovieBySlug(identifier);
    }

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
    return res.status(500).json({ message: 'Lỗi server' });
  }
};