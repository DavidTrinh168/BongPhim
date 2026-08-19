import { Schema, model, Document, Types } from 'mongoose';

export interface IWatchHistory extends Document {
  user_id: Types.ObjectId;
  movie_id: Types.ObjectId;
  episode_id?: Types.ObjectId;
  stopped_at: number; // Thời gian dừng xem phim (tính bằng giây)
  duration_seconds: number; // Tổng số giây của tập/phim (VD: 3600s)
  is_completed: boolean; // Đã xem hết chưa (tính khi stopped_at / duration_seconds >= 0.9)
  created_at: Date;
  updated_at: Date;
}

const WatchHistorySchema = new Schema<IWatchHistory>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movie_id: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    episode_id: { type: Schema.Types.ObjectId, ref: 'Episode' },
    stopped_at: { type: Number, default: 0 },
    duration_seconds: { type: Number, default: 0, min: 0 },
    is_completed: { type: Boolean, default: false, index: true }, // Đánh index để query nhanh các phim chưa xem xong
  },
  { timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'} },
);

// Tạo Compound Index để mỗi User chỉ có 1 bản ghi duy nhất cho 1 bộ phim (xem lại thì update stopped_at)
WatchHistorySchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

// Index hỗ trợ query lấy danh sách "Tiếp tục xem" mới nhất của User
WatchHistorySchema.index({ user_id: 1, is_completed: 1, updated_at: -1 });

const WatchHistory = model<IWatchHistory>('WatchHistory', WatchHistorySchema);

export default WatchHistory;

// export default model<IWatchHistory>('WatchHistory', WatchHistorySchema);