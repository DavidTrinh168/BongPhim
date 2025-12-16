import type { Request, Response } from 'express';
import * as movieService from '../services/movie.service.js'; 

export const addMovie = async (req: Request, res: Response) => {
    try {
        const movieData = req.body;
        
        const savedMovie = await movieService.createMovie(movieData); 
        
        res.status(201).json({
            message: 'Movie or Series added successfully',
            data: savedMovie
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
            data: movies
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};