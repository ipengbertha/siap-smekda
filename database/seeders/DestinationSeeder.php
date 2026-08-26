<?php

namespace Database\Seeders;

use App\Models\Destination;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            'Wakasek Kesiswaan',
            'Wakasek Sarana Prasarana',
            'BK (Bimbingan Konseling)',
            'Tata Usaha',
            'Hubungan Industri',
            'Perpustakaan',
            'Kepala Sekolah',
        ];

        foreach ($destinations as $name) {
            Destination::create([
                'name' => $name,
                'is_active' => true,
            ]);
        }
    }
}