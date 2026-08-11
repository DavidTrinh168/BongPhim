import { Schema, model, Document } from 'mongoose';

export interface IGenre extends Document {
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
}

const GenreSchema = new Schema<IGenre>({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // Slug dùng để làm URL ở Frontend, ví dụ: /genres/hanh-dong
  description: { type: String },
  is_active: { type: Boolean, default: true, index: true } 
}, { timestamps: true }); 

const Genre = model<IGenre>('Genre', GenreSchema);
export default Genre;
