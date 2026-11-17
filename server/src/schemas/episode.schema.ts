import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Định nghĩa phần Body riêng để tiện tái sử dụng
const baseEpisodeBody = z.object({
  movieId: z
    .string({
      error: (iss) => (iss.input === undefined ? 'Movie ID không được để trống' : 'Movie ID phải là chuỗi văn bản'),
    })
    .regex(objectIdRegex, 'Movie ID không đúng định dạng'),

  episode_number: z
    .number({
      error: (iss) => (iss.input === undefined ? 'Số tập (episode_number) không được để trống' : 'Số tập phải là kiểu số'),
    })
    .int('Số tập phải là số nguyên')
    .positive('Số tập phải lớn hơn 0'),

  season_number: z
    .number({
      error: (iss) => (iss.input === undefined ? 'Số mùa (season_number) không được để trống' : 'Số mùa phải là kiểu số'),
    })
    .int('Số mùa phải là số nguyên')
    .positive('Số mùa phải lớn hơn 0'),

  title: z.string().trim().optional(),

  video_url: z
    .string({
      error: (iss) => (iss.input === undefined ? 'Video URL không được để trống' : 'Video URL phải là chuỗi văn bản'),
    })
    .url('Video URL không đúng định dạng link'),

    is_active: z.boolean().optional(),

  // Sử dụng z.coerce.date() vì Frontend thường gửi ngày tháng lên dưới dạng chuỗi ISO string. 
  // Coerce sẽ tự động ép kiểu chuỗi đó về Date object hợp lệ trước khi pass qua Controller.
  release_date: z.coerce
    .date({
      error: () => 'Ngày phát hành (release_date) không đúng định dạng thời gian',
    })
    .optional(),
});

// Wrap vào object { body: ... } để đồng bộ với req của Express
export const createEpisodeSchema = z.object({
  body: baseEpisodeBody.strict(),
});

// Update schema: Tái sử dụng lại toàn bộ rule, nhưng cho phép các trường đều là optional
export const updateEpisodeSchema = z.object({
  body: baseEpisodeBody.partial().strict(),
});

// Xuất type DTO để dùng ép kiểu (Type Casting) trong Controller
// export type CreateEpisodeInput = z.infer<typeof baseEpisodeBody>;
// export type UpdateEpisodeInput = z.infer<typeof updateEpisodeSchema>['body'];