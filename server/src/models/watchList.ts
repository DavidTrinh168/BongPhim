import { Schema, model, Document, Types } from 'mongoose';

export interface IWatchList extends Document {
  user_id: Types.ObjectId;
  list_name: string;
  movies: Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const WatchListSchema = new Schema<IWatchList>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    list_name: { type: String, required: true, trim: true, default: 'Xem sau' },
    movies: [{ type: Schema.Types.ObjectId, ref: 'Movie', required: true }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

// 1. CHUẨN LẠI INDEX: Đảm bảo 1 User không thể tạo 2 danh sách có cùng list_name
WatchListSchema.index({ user_id: 1, list_name: 1 }, { unique: true });

// 2. Index hỗ trợ query (Tuỳ chọn)
WatchListSchema.index({ user_id: 1, created_at: -1 });

const WatchList = model<IWatchList>('WatchList', WatchListSchema);
export default WatchList;
