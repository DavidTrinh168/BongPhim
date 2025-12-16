import { Schema, model, Document } from 'mongoose';

export interface IEpisode {
    episode_number: number; // Số tập (ví dụ: 1, 2, 3...)
    season_number: number;  // Số mùa (ví dụ: 1, 2, 3...)
    title?: string;        // Tên tập phim (tùy chọn)
    video_url: string;    // Link video của tập phim
    duration: number;     // Thời lượng tập phim (phút)
    release_date: Date;
  }

export interface IMovie extends Document { // Extends Document để Mongoose hoạt động tốt
    title: string;
    viTitle: string;
    poster_url: string;
    content_type: 'movie' | 'series'; // Phân loại: Phim lẻ hay Phim bộ
    trailer_url: string;
    year: number;
    genres: string[];
    rating: number; 
    description: string;
    is_trending: boolean;
    slug: string; // URL thân thiện với SEO
  
    // Trường chỉ áp dụng cho PHIM LẺ (Content Type: 'movie')
    duration?: number; // Đặt TÙY CHỌN, chỉ dùng cho phim lẻ
  
    // Trường chỉ áp dụng cho PHIM BỘ (Content Type: 'series')
    episodes?: IEpisode[]; // Mảng các tập phim (dùng cấu trúc lồng nhau)
  
    created_at?: Date;
    updated_at?: Date;
  }

const EpisodeSchema = new Schema<IEpisode>({
    episode_number: { type: Number, required: true },
    season_number: { type: Number, required: true },
    title: { type: String, trim: true },
    video_url: { type: String, required: true },
    duration: { type: Number, required: true },
    release_date: { type: Date, default: Date.now },
  });
  
  const MovieSchema = new Schema<IMovie>({
    title: { type: String, required: true, trim: true, unique: true },
    viTitle: { type: String, required: false, trim: true, unique: false },
    poster_url: { type: String, required: true },
    content_type: { 
      type: String, 
      enum: ['movie', 'series'], 
      required: true 
    },
    trailer_url: { type: String },
    year: { type: Number, required: true },
    genres: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    description: { type: String },
    is_trending: { type: Boolean, default: false },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    
    // Trường áp dụng riêng cho PHIM LẺ (Nếu content_type là 'movie')
    duration: { type: Number },
    
    // Trường áp dụng riêng cho PHIM BỘ (Nếu content_type là 'series')
    episodes: [EpisodeSchema], // Sử dụng Schema lồng nhau
  
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
  }, { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
  });
  
  // Export Model
  const Movie = model<IMovie>('Movie', MovieSchema);
  export default Movie;