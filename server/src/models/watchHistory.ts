import {Schema, model, Document, Types} from 'mongoose';

export interface IWatchHistory extends Document {
    user_id: Types.ObjectId;
    movie_id: Types.ObjectId;
    episode_id?: Types.ObjectId;
    stopped_at: number; // Thời gian dừng xem phim (tính bằng giây)
    updated_at: Date;
}

const WatchHistorySchema = new Schema<IWatchHistory>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    movie_id: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    episode_id: { type: Schema.Types.ObjectId, ref: 'Episode' },
    stopped_at: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Tạo Compound Index để mỗi User chỉ có 1 bản ghi duy nhất cho 1 bộ phim (xem lại thì update stopped_at)
WatchHistorySchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

export default model<IWatchHistory>('WatchHistory', WatchHistorySchema);