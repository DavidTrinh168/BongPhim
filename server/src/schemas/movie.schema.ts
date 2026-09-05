import { z } from 'zod';

// Regex kiểm tra chuỗi có phải là MongoDB ObjectId hợp lệ hay không
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Định nghĩa phần Body riêng để tiện tái sử dụng và Validate chéo
const baseMovieBody = z.object({
  title: z
    .string({
      error: (iss) => {
        // iss.input === undefined nghĩa là user không gửi trường này lên
        if (iss.input === undefined) return 'Tiêu đề không được trống';
        // Trường hợp user gửi số, boolean, array...
        return 'Tiêu đề phải là một chuỗi văn bản';
      },
    })
    .trim()
    .min(1, 'Tiêu đề không được để trống'),

  viTitle: z.string().trim().optional(),

  poster_url: z.url({
    error: (iss) => iss.input === undefined ? "Poster URL không được trống" : " Poster URL không đúng định dạng link"
  }),

  content_type: z.enum(
    ['movie', 'series'],
    "Content type không được trống và chỉ được là 'movie' hoặc 'series'",
  ),

  trailer_url: z.url('Trailer URL không đúng định dạng link').optional(),

  year: z
    .number('Năm phát hành không được trống')
    .int('Năm phải là số nguyên')
    .min(1888, 'Năm phát hành phải từ năm 1888 trở đi')
    .max(new Date().getFullYear() + 2, 'Năm phát hành không được vượt quá tương lai xa'),

  genres: z
    .array(z.string().regex(objectIdRegex, 'ID thể loại (Genre) không hợp lệ'))
    .optional()
    .default([]),

  crew: z
    .array(z.string().regex(objectIdRegex, 'ID nhân sự (Crew) không hợp lệ'))
    .optional()
    .default([]),

  countries: z
    .array(z.string().regex(objectIdRegex, 'ID quốc gia (Country) không hợp lệ'))
    .optional()
    .default([]),

  description: z.string().trim().optional(),

  slug: z.string().trim().min(1, 'Slug không được để trống'),

  // Zod .positive() đã bao hàm điều kiện duration > 0 nếu user có truyền vào
  duration: z.number().positive('Thời lượng phim phải lớn hơn 0').optional(),
});

const createMovieBody = baseMovieBody.superRefine((data, ctx) => {
  // Validate chéo (Cross-field validation): Nếu là movie thì duration là bắt buộc
  if (data.content_type === 'movie' && !data.duration) {
    ctx.addIssue({
      code: 'custom',
      message: 'Phim lẻ (movie) bắt buộc phải nhập thời lượng (duration)',
      path: ['duration'], // Trỏ đúng lỗi vào field duration
    });
  }
});

// Wrap vào object { body: ... } để đồng bộ với req của Express
export const createMovieSchema = z.object({
  body: createMovieBody,
});

// Update schema: Tái sử dụng lại toàn bộ rule, nhưng chuyển thành optional
export const updateMovieSchema = z.object({
  body: baseMovieBody.partial(),
});

// // Xuất type DTO để dùng trong Controller
// export type CreateMovieInput = z.infer<typeof createMovieBody>;
// export type UpdateMovieInput = z.infer<typeof updateMovieSchema>['body'];
