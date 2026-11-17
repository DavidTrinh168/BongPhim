import Episode, { type IEpisode } from '../models/Episode.js'; // Import Model
import Movie, { type IMovie } from '../models/Movie.js'; // Import Model
import { ApiError } from '../utils/ApiError.js';

// ========================================================[PUBLIC]=============================================================

export const findSeriesBySlug = async (slug: string) => {
  const series = await Movie.findOne({ slug, content_type: 'series', is_active: true, }).select('_id slug title');
  
  if (!series) {
    throw new ApiError(404, 'Không tìm thấy Series');
  }

  return series;
};

export const findAllPublicSeasons = async (slugPara: string) => {
  const series = await findSeriesBySlug(slugPara);
  const seasons = await Episode.distinct('season_number', { movieId: series._id, is_active: true, });
  return seasons.sort((a, b) => a - b);
};

export const findAllPublicEpisodes = async (slugPara: string, seasonQuer: string, ) => {
  
  const series = await findSeriesBySlug(slugPara);

  return await Episode.find({ movieId: series._id, season_number: Number(seasonQuer), is_active: true })
    .sort({ episode_number: 1 })
    .select('-video_url')
    .lean();
};

export const findPublicEpisodeDetailBySlug = async (slug: string, seSlugPara: number, epSlugPara: number ) => {
  
  const series = await findSeriesBySlug(slug);
  
  const epDetail = await Episode.findOne({ movieId: series._id, episode_number: epSlugPara, season_number: seSlugPara, is_active: true }).select('-createdAt -updatedAt -video_url -__v')
  
  return epDetail;
};

// ===============================================================[CMS]====================================================================

export const findSeriesById = async (id: string) => {
  const series = await Movie.findOne({ _id: id, content_type: 'series' }).select('_id slug title');
  if (!series) {
    throw new ApiError(404, 'Không tìm thấy Series');
  }
  return series;
};

export const createEpisode = async (episodeData: IEpisode) => {
  await findSeriesById(episodeData.movieId.toString());
  const newEpisode = new Episode(episodeData);
  return await newEpisode.save();
};

export const findAllEpisodes = async (movieId: string) => {
  const episodes = await Episode.find({movieId}).sort({ season_number: 1, episode_number: 1 }).lean();
  return episodes;
};

export const findEpisodeById = async (id: string) => {
  const episode = await Episode.findById(id);
  return episode;
};

export const updateEpisode = async (id: string, episodeData: Partial<IEpisode>) => {
  const episodeExists = await Episode.exists({ _id: id });

  if (!episodeExists) {
    throw new ApiError(404, 'Không tìm thấy Episode');
  }
  
  if (episodeData.movieId) {
    await findSeriesById(episodeData.movieId.toString());
  }
  const updatedEpisode = await Episode.findByIdAndUpdate(id, episodeData, { new: true, runValidators: true });
  return updatedEpisode;
};

export const deleteEpisodeByID = async (id: string) => {
  const deletedEpisode = await Episode.findByIdAndDelete(id);
  return deletedEpisode;
};
