import Episode, { type IEpisode } from '../models/Episode.js'; // Import Model
import Movie, { type IMovie } from '../models/Movie.js'; // Import Model


// [PUBLIC]====================================================================
export const findAllPublicSeasons = async (slugPara: string) => {
  const series = await Movie.findOne({ slug: slugPara, is_active: true, content_type: 'series' }).select('_id');
  
  if (!series) {
    throw new Error('Series not found');
  }
  
  const seasons = await Episode.distinct('season_number', { movieId: series._id });
  return seasons.sort((a, b) => a - b);
};

export const findAllPublicEpisodes = async (slugPara: string, seasonQuer: string, ) => {
  
  const series = await Movie.findOne({ slug: slugPara, is_active: true, content_type: 'series' }).populate({ path: 'episodes', match: { season_number: Number(seasonQuer) }, options: { sort: { episode_number: 1 }}});
  
  if (!series) {
    throw new Error('Series not found');
  }
  
  return series;
};

export const findPublicEpisodeDetailBySlug = async (slugPara: string, epSlugPara: number, seSlugPara: number ) => {
  
  const series = await Movie.findOne({ slug: slugPara, is_active: true, content_type: 'series' }).select('_id')
  
  if (!series) {
    throw new Error('Series not found');
  }
  
  const epDetail = await Episode.findOne({ movieId: series._id, episode_number: epSlugPara, season_number: seSlugPara, is_active: true, })
  
  return epDetail;
};

// [CMS]====================================================================
export const createEpisode = async (episodeData: IEpisode) => {
  const series = await Movie.findById(episodeData.movieId);

  if (!series) {
    throw new Error('Series not found');
  }

  if ( (series.content_type) !== 'series' ) {
    throw new Error('This movie is not a series');
  }

  const newEpisode = new Episode(episodeData);
  const savedEpisode = await newEpisode.save();

  return savedEpisode;
};