<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Preferensi notifikasi per user. Default true semua (opt-out),
     * supaya user lama nggak tiba-tiba berhenti dapat notifikasi
     * setelah kolom ini ditambahkan.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Admin: notif saat ada aduan baru masuk.
            $table->boolean('notify_new_report')->default(true)->after('status');

            // Pelapor: notif saat admin memberi tanggapan pada aduannya.
            $table->boolean('notify_report_responded')->default(true)->after('notify_new_report');

            // Pelapor: notif saat status aduannya berubah (selain jadi "selesai").
            $table->boolean('notify_status_changed')->default(true)->after('notify_report_responded');

            // Pelapor: notif saat aduannya ditandai selesai.
            $table->boolean('notify_report_completed')->default(true)->after('notify_status_changed');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'notify_new_report',
                'notify_report_responded',
                'notify_status_changed',
                'notify_report_completed',
            ]);
        });
    }
};