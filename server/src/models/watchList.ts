import { Schema, model, Document, Types } from 'mongoose';

export interface IWatchList extends Document {
  user_id: Types.ObjectId;
  list_name: string;
  movie_id: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const WatchListSchema = new Schema<IWatchList>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    list_name: { type: String, required: true, trim: true, index: true, unique: true, default: 'Xem sau' },
    movie_id: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

// 1. Chặn việc thêm trùng 1 bộ phim vào cùng 1 danh sách của User
WatchListSchema.index({ user_id: 1, list_name: 1, movie_id: 1 }, { unique: true });

// 2. Index hỗ trợ query lấy danh sách phim xem sau mới nhất của User
WatchListSchema.index({ user_id: 1, list_name: 1, created_at: -1 });

const WatchList = model<IWatchList>('WatchList', WatchListSchema);
export default WatchList;
