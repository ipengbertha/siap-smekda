import { z } from 'zod';

export const reportSchema = z.object({
    type: z.enum(['aduan', 'aspirasi'], {
        required_error: 'Pilih jenis laporan.',
    }),
    category_id: z.string().min(1, 'Kategori wajib dipilih.'),
    title: z
        .string()
        .min(1, 'Judul wajib diisi.')
        .max(255, 'Judul maksimal 255 karakter.'),
    description: z
        .string()
        .min(10, 'Isi laporan minimal 10 karakter.'),
    is_anonymous: z.boolean().default(false),
});