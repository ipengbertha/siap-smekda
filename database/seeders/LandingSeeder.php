<?php

namespace Database\Seeders;

use App\Models\LandingSetting;
use App\Models\LandingStat;
use App\Models\LandingFaq;
use App\Models\LandingStep;
use Illuminate\Database\Seeder;

class LandingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Landing Settings (key-value)
        $settings = [
            'hero_title'    => 'Suarakan Aspirasimu. Wujudkan Perubahan Bersama.',
            'hero_subtitle' => 'Ada yang perlu diperbaiki? Punya ide untuk sekolah? Sampaikan melalui SIAP SMEKDA — setiap aspirasi dan laporan jadi bagian dari upaya menciptakan lingkungan sekolah yang lebih baik.',

            // Footer — kontak
            'footer_copyright' => '© 2026 SIAP SMEKDA — SMK Negeri 1 Daha Selatan.',
            'footer_email'      => 'info@smekda.sch.id',
            'footer_phone'      => '(0517) 21XXX',
            'footer_address'    => 'Jl. Pendidikan No. 1, Daha Selatan, Hulu Sungai Selatan, Kalimantan Selatan',

            // Footer — social media
            'social_instagram' => 'https://instagram.com/smekda',
            'social_facebook'  => 'https://facebook.com/smekda',
            'social_youtube'   => '',
            'social_whatsapp'  => '',
        ];

        foreach ($settings as $key => $value) {
            LandingSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        // 2. Landing Stats
        $stats = [
            ['label' => 'Laporan Diterima', 'value' => '1.245', 'order' => 1],
            ['label' => 'Laporan Ditangani', 'value' => '1.180', 'order' => 2],
            ['label' => 'Warga Merasa Terbantu', 'value' => '94%', 'order' => 3],
            ['label' => 'Rata-rata Respons', 'value' => '< 2 Hari', 'order' => 4],
        ];

        foreach ($stats as $stat) {
            LandingStat::updateOrCreate(
                ['label' => $stat['label']],
                $stat + ['is_active' => true]
            );
        }

        // 3. Landing Steps (cara kerja)
        $steps = [
            [
                'title'       => 'Sampaikan',
                'description' => 'Ceritakan apa yang ingin kamu laporkan. Isi formulir sesuai masalah atau aspirasi — bisa pakai akun atau anonim.',
                'order'       => 1,
            ],
            [
                'title'       => 'Kami Periksa',
                'description' => 'Laporanmu akan diverifikasi dulu, lalu diteruskan ke pihak yang tepat.',
                'order'       => 2,
            ],
            [
                'title'       => 'Dalam Penanganan',
                'description' => 'Pihak terkait menangani laporan sesuai jenis permasalahan dan kebutuhan di lapangan.',
                'order'       => 3,
            ],
            [
                'title'       => 'Selesai',
                'description' => 'Lihat hasil penyelesaian dan berikan penilaian terhadap layanan.',
                'order'       => 4,
            ],
        ];

        foreach ($steps as $step) {
            LandingStep::updateOrCreate(
                ['title' => $step['title']],
                $step
            );
        }

        // 4. Landing FAQs
        $faqs = [
            [
                'question' => 'Apakah saya harus login untuk mengirim laporan?',
                'answer'   => 'Tidak. Kamu dapat mengirim laporan tanpa login. Namun, memiliki akun akan memudahkanmu melihat riwayat laporan dan memantau perkembangannya.',
                'order'    => 1,
            ],
            [
                'question' => 'Apakah saya bisa mengirim laporan secara anonim?',
                'answer'   => 'Bisa. Kamu dapat memilih opsi anonim saat mengirim laporan. Identitas pelapor tidak akan ditampilkan kepada publik.',
                'order'    => 2,
            ],
            [
                'question' => 'Kapan laporan saya akan mendapat respons?',
                'answer'   => 'Laporan akan diverifikasi terlebih dahulu sebelum diteruskan kepada pihak terkait. Rata-rata waktu respons awal adalah kurang dari dua hari kerja.',
                'order'    => 3,
            ],
            [
                'question' => 'Bagaimana cara melacak laporan saya?',
                'answer'   => 'Setiap laporan memiliki kode unik. Masukkan kode tersebut pada fitur Lacak Laporan untuk melihat perkembangan laporanmu.',
                'order'    => 4,
            ],
            [
                'question' => 'Apakah semua laporan akan langsung diselesaikan?',
                'answer'   => 'Setiap laporan akan melalui proses verifikasi dan penanganan sesuai dengan jenis permasalahannya. Status laporan akan diperbarui selama proses berlangsung.',
                'order'    => 5,
            ],
        ];

        foreach ($faqs as $faq) {
            LandingFaq::updateOrCreate(
                ['question' => $faq['question']],
                $faq + ['is_active' => true]
            );
        }
    }
}