import type { Request, Response } from 'express';
import * as episodeService from '../services/episode.service.js';
import { isValidStringParam } from '../utils/helper.js';
import { handleControllerError } from '../utils/handleControllerError.js';

// [PUBLIC]====================================================================
export const getPublicSeasons = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!isValidStringParam(slug, 'slug')) {
      return res.status(400).json({
        status: 'fail',
        message: 'Slug không hợp lệ',
      });
    }

    const seasons = await episodeService.findAllPublicSeasons(slug);

    res.status(200).json({
      status: "success",
      message: 'Seasons retrieved successfully',
      count: seasons.length,
      data: seasons,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getPublicEpisodes = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { season } = req.query;

    if (!isValidStringParam(slug, 'slug')) {
      return res.status(400).json({
        status: 'fail',
        message: 'Slug không hợp lệ',
      });
    }

    if (typeof season !== 'string') {
      return res.status(400).json({
        status: 'fail',
        message: 'Season không hợp lệ',
      });
    }

    const episodes = await episodeService.findAllPublicEpisodes(slug, season);

    res.status(200).json({
      status: "success",
      message: 'Episodes retrieved successfully',
      count: episodes.length,
      data: episodes,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getPublicEpisodeDetail = async (req: Request, res: Response) => {
  try {
    const { slug, seSlug, epSlug } = req.params;

    if (!isValidStringParam(slug, 'slug')) {
      return res.status(400).json({
        status: 'fail',
        message: 'Slug không hợp lệ',
      });
    }

    if (!isValidStringParam(epSlug, 'epSlug')) {
      return res.status(400).json({
        status: 'fail',
        message: 'Slug tập phim không hợp lệ',
      });
    }

    if (!isValidStringParam(seSlug, 'seSlug')) {
      return res.status(400).json({
        status: 'fail',
        message: 'Slug mùa phim không hợp lệ',
      });
    }

    const episode = await episodeService.findPublicEpisodeDetailBySlug(slug, Number(seSlug), Number(epSlug));

    if (!episode) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy tập phim này',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: episode,
    });

  } catch (error) {
    return handleControllerError(res, error);
  }
};

// [CMS]====================================================================
export const createrEpisode = async (req: Request, res: Response) => {
  try {
    const episodeData = req.body;

    const savedEpisode = await episodeService.createEpisode(episodeData);

    res.status(201).json({
      message: 'Episode added successfully',
      data: savedEpisode,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};


export const getEpisodes = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.query;

    if (!isValidStringParam(movieId, 'id')) {
      return res.status(400).json({
        status: 'fail',
        message: 'ID không hợp lệ',
      });
    }

    // Kiểm tra Movie có tồn tại không
    const series = await episodeService.findSeriesById(movieId);

    // Lấy danh sách episodes
    const episodes = await episodeService.findAllEpisodes(series._id.toString());

    return res.status(200).json({
      status: 'success',
      message: 'Episodes retrieved successfully',
      count: episodes.length,
      data: episodes,
    });

  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getEpisodeDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidStringParam(id, 'id')) {
      return res.status(400).json({
        status: 'fail',
        message: 'Episode ID không hợp lệ',
      });
    }

    const episode = await episodeService.findEpisodeById(id);

    if (!episode)
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy tập phim này',
      });

    return res.status(200).json({
      status: 'success',
      data: episode,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const updateEpisode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const episodeData = req.body;

    if (!isValidStringParam(id, 'id')) {
      return res.status(400).json({
        status: 'fail',
        message: 'Episode ID không hợp lệ',
      });
    }

    const updatedEpisode = await episodeService.updateEpisode(id, episodeData);

    // Xử lý trường hợp phim không tồn tại
    if (!updatedEpisode) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy tập phim này để cập nhật',
      });
    }

    res.status(200).json({
      status: "success",
      message: 'Episode or Series updated successfully',
      data: updatedEpisode,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const deleteEpisode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidStringParam(id, 'id')) {
      return res.status(400).json({
        status: 'fail',
        message: 'episodeId không hợp lệ',
      });
    }

    const deletedEpisode = await episodeService.deleteEpisodeByID(id);

    if (!deletedEpisode) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy tập phim này hoặc đã bị xóa',
      });
    }

    res.status(204).send();
  } catch (error) {
    return handleControllerError(res, error);
  }
};

