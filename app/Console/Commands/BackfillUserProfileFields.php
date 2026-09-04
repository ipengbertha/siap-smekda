<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class BackfillUserProfileFields extends Command
{
    /**
     * Jalankan: php artisan users:backfill-profile
     * Tambahkan --dry-run untuk cuma lihat apa yang AKAN diubah, tanpa nyimpen.
     */
    protected $signature = 'users:backfill-profile {--dry-run}';

    protected $description = 'Isi username/phone user lama yang kosong akibat bug $fillable (aman dijalankan berkali-kali, tidak menimpa data yang sudah ada).';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $affected = User::query()
            ->where(function ($q) {
                $q->whereNull('username')
                    ->orWhere('username', '')
                    ->orWhereNull('phone')
                    ->orWhere('phone', '');
            })
            ->get();

        if ($affected->isEmpty()) {
            $this->info('Tidak ada user dengan username/phone kosong. Aman, tidak ada yang perlu dibenerin.');

            return self::SUCCESS;
        }

        $this->warn("Ditemukan {$affected->count()} user dengan username/phone kosong:");

        foreach ($affected as $user) {
            $changes = [];

            if (blank($user->username)) {
                $base = Str::slug(Str::before($user->email, '@'), '_') ?: 'user';
                $candidate = $base;
                $i = 1;
                while (User::where('username', $candidate)->where('id', '!=', $user->id)->exists()) {
                    $candidate = $base.'_'.(++$i);
                }
                $changes['username'] = $candidate;
            }

            if (blank($user->phone)) {
                $changes['phone'] = '-';
            }

            $this->line("  #{$user->id} {$user->name} <{$user->email}> → ".json_encode($changes));

            if (! $dryRun) {
                $user->forceFill($changes)->save();
            }
        }

        if ($dryRun) {
            $this->comment('Dry-run selesai, belum ada yang disimpan. Jalankan tanpa --dry-run untuk benar-benar apply.');
        } else {
            $this->info('Selesai. Username auto-generate dari email, phone diisi placeholder "-" — tolong minta user yang bersangkutan lengkapi ulang lewat edit profil.');
        }

        return self::SUCCESS;
    }
}
