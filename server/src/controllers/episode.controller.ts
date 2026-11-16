import type { Request, Response } from 'express';
import * as episodeService from '../services/episode.service.js';
import { isValidStringParam } from '../utils/helper.js';

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
      message: 'Seasons retrieved successfully',
      count: seasons.length,
      data: seasons,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};

// [PUBLIC]
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

    const episodes: any = await episodeService.findAllPublicEpisodes(slug, season);

    res.status(200).json({
      message: 'Episodes retrieved successfully',
      count: episodes.length,
      data: episodes,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error instanceof Error ? error.message : 'Server error',
    });
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
    res.status(500).json({
      status: 'fail',
      message: error instanceof Error ? error.message : 'Server error',
    });
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
    if (error && (error as any).code === 11000) {
      return res.status(409).json({ message: 'Episode already exists.' });
    }
    res.status(500).json({
      status: 'fail',
      message: error instanceof Error ? error.message : 'Server error',
    });;
  }
};


// export const getEpisodes = async (req: Request, res: Response) => {
//   try {
//     const { slug } = req.params;

//     if (!isValidStringParam(slug, 'slug')) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Slug không hợp lệ',
//       });
//     }
//     const episodes: any = await episodeService.findAllEpisodes(slug);
//     // logic phân trang
//     res.status(200).json({
//       message: 'Episodes retrieved successfully',
//       count: episodes.length,
//       data: episodes,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const getEpisodeDetail = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!isValidStringParam(id, 'id')) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Episode ID không hợp lệ',
//       });
//     }

//     const episode = await episodeService.findEpisodeById(id);

//     if (!episode)
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Không tìm thấy tập phim này',
//       });

//     return res.status(200).json({
//       status: 'success',
//       data: episode,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Lỗi server' });
//   }
// };

// export const updateEpisode = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const episodeData = req.body;

//     if (!isValidStringParam(id, 'id')) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Episode ID không hợp lệ',
//       });
//     }

//     const updatedEpisode = await episodeService.updateEpisode(id, episodeData);

//     // Xử lý trường hợp phim không tồn tại
//     if (!updatedEpisode) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Không tìm thấy tập phim này để cập nhật',
//       });
//     }

//     res.status(200).json({
//       message: 'Episode or Series updated successfully',
//       data: updatedEpisode,
//     });
//   } catch (error) {
//     if (error && (error as any).code === 11000) {
//       return res.status(409).json({ message: 'Title or Slug already exists.' });
//     }
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const deleteEpisode = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!isValidStringParam(id, 'id')) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'episodeId không hợp lệ',
//       });
//     }

//     const deletedEpisode = await episodeService.deleteEpisodeByID(id);

//     //vì delete thành công sẽ return lại thông tin episode đã xóa nên kiểm tra
//     if (!deletedEpisode) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Không tìm thấy tập phim này hoặc đã bị xóa',
//       });
//     }

//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
