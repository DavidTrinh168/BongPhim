import { Schema, model, Document, Types } from 'mongoose';

export interface IEpisode extends Document {
  movieId: Types.ObjectId;
  episode_number: number; // Số tập (ví dụ: 1, 2, 3...)
  season_number: number; // Số mùa (ví dụ: 1, 2, 3...)
  title?: string; // Tên tập phim (tùy chọn)
  video_url: string; // Link video của tập phim
  release_date: Date;
}

const episodeSchema = new Schema<IEpisode>(
  {
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
    episode_number: { type: Number, required: true },
    season_number: { type: Number, required: true },
    title: { type: String, trim: true },
    video_url: { type: String, required: true },
    release_date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Đảm bảo trong 1 phim, không thể có 2 tập trùng số trong cùng 1 mùa
episodeSchema.index({ movieId: 1, season_number: 1, episode_number: 1 }, { unique: true });

// Export Model
const Episode = model<IEpisode>('Episode', episodeSchema);
export default Episode;
