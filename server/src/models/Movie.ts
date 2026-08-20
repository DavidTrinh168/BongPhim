import { Schema, model, Document, Types } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  viTitle?: string;
  poster_url: string;
  content_type: 'movie' | 'series';
  trailer_url?: string;
  year: number;
  genres: Types.ObjectId[];
  rating: number;
  description?: string;
  is_trending: boolean;
  slug: string;
  duration?: number;
  crew: Types.ObjectId[];
  countries: Types.ObjectId[];
  created_at?: Date;
  updated_at?: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true, unique: true },
    viTitle: { type: String, trim: true },
    poster_url: { type: String, required: true },
    content_type: {
      type: String,
      enum: ['movie', 'series'],
      required: true,
      index: true,
    },
    trailer_url: { type: String },
    year: { type: Number, required: true, index: true },
    genres: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
      default: [],
      index: true,
    },
    crew: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Crew' }],
      default: [],
    },
    countries: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Country' }],
      default: [],
      index: true,
    },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    description: { type: String },
    is_trending: { type: Boolean, default: false, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    duration: { type: Number },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual Populate lấy danh sách tập phim
MovieSchema.virtual('episodes', {
  ref: 'Episode',
  localField: '_id',
  foreignField: 'movieId',
});

const Movie = model<IMovie>('Movie', MovieSchema);
export default Movie;
