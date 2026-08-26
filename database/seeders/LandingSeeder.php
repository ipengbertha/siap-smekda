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
        // Ganti/tambahkan di dalam array $settings
        $settings = [
            'hero_title'    => 'Sistem Informasi Aspirasi & Aduan',
            'hero_subtitle' => 'Sampaikan aduan dan aspirasimu untuk SMK Negeri 1 Daha Selatan menjadi lebih baik. Cepat, transparan, dan bisa dipantau langsung.',

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
            ['label' => 'Total Aduan Masuk', 'value' => '1.245', 'order' => 1],
            ['label' => 'Aduan Terselesaikan', 'value' => '1.180', 'order' => 2],
            ['label' => 'Tingkat Kepuasan', 'value' => '94%', 'order' => 3],
            ['label' => 'Rata-rata Respon', 'value' => '< 2 Hari', 'order' => 4],
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
                'description' => 'Isi form aduan atau aspirasi dengan kategori dan tujuan yang sesuai. Bisa login atau tanpa login.',
                'order'       => 1,
            ],
            [
                'title'       => 'Verifikasi',
                'description' => 'Admin memeriksa dan memverifikasi aduan yang masuk, lalu menentukan prioritas dan tujuan penanganan.',
                'order'       => 2,
            ],
            [
                'title'       => 'Diproses',
                'description' => 'Pihak terkait menindaklanjuti aduan sesuai kategorinya, dan progres dapat dipantau secara real-time.',
                'order'       => 3,
            ],
            [
                'title'       => 'Selesai',
                'description' => 'Aduan ditandai selesai, dan pelapor dapat memberi rating serta tanggapan atas penanganan yang dilakukan.',
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
                'question' => 'Apakah saya harus login untuk mengirim aduan?',
                'answer'   => 'Tidak wajib. Kamu bisa mengirim aduan tanpa login, namun dengan login kamu bisa memantau riwayat dan mendapat notifikasi status aduan.',
                'order'    => 1,
            ],
            [
                'question' => 'Apakah identitas saya akan dirahasiakan?',
                'answer'   => 'Ya, jika kamu memilih opsi anonim, identitasmu tidak akan ditampilkan ke pihak manapun kecuali admin untuk keperluan verifikasi internal.',
                'order'    => 2,
            ],
            [
                'question' => 'Berapa lama aduan saya akan ditindaklanjuti?',
                'answer'   => 'Rata-rata aduan diverifikasi dalam 1x24 jam dan mulai ditindaklanjuti dalam waktu kurang dari 2 hari, tergantung kompleksitas dan kategori aduan.',
                'order'    => 3,
            ],
            [
                'question' => 'Bagaimana cara melacak status aduan saya?',
                'answer'   => 'Gunakan fitur "Lacak Aduan" di halaman utama dengan memasukkan kode aduan yang diberikan setelah pengiriman, misalnya ADU-2026-00125.',
                'order'    => 4,
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