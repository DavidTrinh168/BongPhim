import { Schema, model, Document } from 'mongoose';

export interface ICrew extends Document {
  name: string;
  another_name: string;
  avatar_url?: string;
  bio?: string;
  gender: 'male' | 'female' | 'other';
  birth_date: Date;
  birth_place: string;
  is_active: boolean; // Dùng để ẩn diễn viên dính scandal/vi phạm tiêu chuẩn cộng đồng
}

const CrewSchema = new Schema<ICrew>(
  {
    name: { type: String, required: true, trim: true },
    another_name: { type: String, required: true, trim: true },
    avatar_url: { type: String, trim: true },
    bio: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    birth_date: { type: Date, required: true },
    birth_place: { type: String, required: true, trim: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Đánh index hỗ trợ search diễn viên theo tên
CrewSchema.index({ name: 'text', another_name: 'text' });

const Crew = model<ICrew>('Crew', CrewSchema);
export default Crew;
