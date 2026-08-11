import { Schema, model, Document } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  viName: string;
  slug: string;
  iso_3166_1: string; // Mã quốc gia tiêu chuẩn (e.g., "KR", "US", "VN")
  is_active: boolean; // Trạng thái bật/tắt bộ lọc trên giao diện
}

const CountrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    viName: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    iso_3166_1: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 2,
    },
    is_active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

// Đánh chỉ mục hỗ trợ tìm kiếm nhanh theo tên
CountrySchema.index({ viName: 'text', name: 'text' });

const Country = model<ICountry>('Country', CountrySchema);
export default Country;
