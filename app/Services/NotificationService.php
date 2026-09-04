<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\Report;
use App\Models\User;

class NotificationService
{
    protected const STATUS_LABELS = [
        'terkirim' => 'terkirim',
        'diterima' => 'diterima',
        'diproses' => 'sedang diproses',
        'ditanggapi' => 'ditanggapi',
        'selesai' => 'selesai',
        'ditolak' => 'ditolak',
        'diblokir' => 'diblokir',
    ];

    /**
     * Kirim notif ke pelapor saat admin mengubah status laporannya.
     * Dipanggil dari Admin\ReportController@updateStatus.
     */
    public static function reportStatusChanged(Report $report, string $newStatus): void
    {
        // Kalau nggak ada user_id (harusnya nggak mungkin, tapi jaga-jaga), skip.
        if (! $report->user_id) {
            return;
        }

        $label = self::STATUS_LABELS[$newStatus] ?? $newStatus;

        AppNotification::create([
            'user_id' => $report->user_id,
            'type' => 'sistem',
            'title' => 'Status laporan diperbarui',
            'message' => "Laporan \"{$report->title}\" ({$report->code}) sekarang berstatus \"{$label}\".",
            'report_id' => $report->id,
        ]);
    }

    /**
     * Kirim notif ke pelapor saat admin memberi tanggapan publik (bukan catatan internal).
     * Dipanggil dari Admin\ReportResponseController@store.
     */
    public static function reportResponded(Report $report): void
    {
        if (! $report->user_id) {
            return;
        }

        AppNotification::create([
            'user_id' => $report->user_id,
            'type' => 'sistem',
            'title' => 'Ada tanggapan baru',
            'message' => "Admin memberikan tanggapan pada laporan \"{$report->title}\" ({$report->code}).",
            'report_id' => $report->id,
        ]);
    }

    /**
     * Kirim notif ke semua admin saat ada laporan baru masuk.
     * Dipanggil dari ReportController@store (sisi user).
     */
    public static function newReportSubmitted(Report $report): void
    {
        $admins = User::where('role', 'admin')->get(['id']);

        $rows = $admins->map(fn (User $admin) => [
            'user_id' => $admin->id,
            'type' => 'sistem',
            'title' => 'Laporan baru masuk',
            'message' => "Laporan baru \"{$report->title}\" ({$report->code}) perlu ditindaklanjuti.",
            'report_id' => $report->id,
            'is_read' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($rows->isNotEmpty()) {
            AppNotification::insert($rows->toArray());
        }
    }
}
