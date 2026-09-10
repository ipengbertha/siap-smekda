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
     *
     * Dipisah jadi 2 preferensi: "selesai" punya toggle sendiri,
     * status lainnya (diterima/diproses/ditanggapi/ditolak/diblokir) pakai toggle "status berubah".
     */
    public static function reportStatusChanged(Report $report, string $newStatus): void
    {
        // Kalau nggak ada user_id (harusnya nggak mungkin, tapi jaga-jaga), skip.
        if (! $report->user_id) {
            return;
        }

        $pelapor = User::find($report->user_id);
        if (! $pelapor) {
            return;
        }

        $isCompleted = $newStatus === 'selesai';
        $preferenceEnabled = $isCompleted
            ? $pelapor->notify_report_completed
            : $pelapor->notify_status_changed;

        if (! $preferenceEnabled) {
            return;
        }

        $label = self::STATUS_LABELS[$newStatus] ?? $newStatus;

        AppNotification::create([
            'user_id' => $report->user_id,
            'type' => 'sistem',
            'title' => $isCompleted ? 'Laporan selesai ditangani' : 'Status laporan diperbarui',
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

        $pelapor = User::find($report->user_id);
        if (! $pelapor || ! $pelapor->notify_report_responded) {
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
     * Kirim notif ke pelapor saat laporannya (yang sudah featured) di-like orang lain.
     * Dipanggil dari SorotanController@like. Skip kalau yang like adalah pelapor sendiri.
     *
     * Catatan: belum ada toggle khusus untuk ini di Pengaturan Notifikasi (di luar 4 item
     * yang diminta), jadi tetap dikirim tanpa pengecekan preferensi seperti sebelumnya.
     */
    public static function reportLiked(Report $report, User $liker): void
    {
        if (! $report->user_id || $report->user_id === $liker->id) {
            return;
        }

        AppNotification::create([
            'user_id' => $report->user_id,
            'type' => 'sistem',
            'title' => 'Laporanmu disukai',
            'message' => "{$liker->name} menyukai laporan \"{$report->title}\" ({$report->code}) di Sorotan Publik.",
            'report_id' => $report->id,
        ]);
    }

    /**
     * Kirim notif ke pelapor saat laporannya (yang sudah featured) dapat komentar.
     * Dipanggil dari SorotanController@storeComment. Skip kalau yang komentar adalah pelapor sendiri.
     *
     * Catatan: sama seperti reportLiked(), belum ada toggle khusus untuk ini.
     */
    public static function reportCommented(Report $report, User $commenter): void
    {
        if (! $report->user_id || $report->user_id === $commenter->id) {
            return;
        }

        AppNotification::create([
            'user_id' => $report->user_id,
            'type' => 'sistem',
            'title' => 'Komentar baru di laporanmu',
            'message' => "{$commenter->name} berkomentar di laporan \"{$report->title}\" ({$report->code}) di Sorotan Publik.",
            'report_id' => $report->id,
        ]);
    }

    /**
     * Kirim notif ke semua admin yang mengaktifkan preferensi ini saat ada laporan baru masuk.
     * Dipanggil dari ReportController@store (sisi user).
     */
    public static function newReportSubmitted(Report $report): void
    {
        $admins = User::where('role', 'admin')
            ->where('notify_new_report', true)
            ->get(['id']);

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

    /**
     * Kirim pengumuman ke semua user (admin & user biasa) yang mengaktifkan preferensi ini.
     * Dipanggil dari Admin\AnnouncementController@store.
     *
     * Sengaja dibuat 1 baris notifikasi PER USER (bukan 1 baris broadcast dengan user_id
     * null seperti sebelumnya), supaya toggle "Notifikasi pengumuman" bisa benar-benar
     * ngefek per orang — kalau tetap 1 baris broadcast, nggak ada cara nyembunyiin
     * notifikasi itu dari user yang mematikan toggle-nya.
     */
    public static function announcementCreated(string $title, string $message): void
    {
        $users = User::where('notify_pengumuman', true)->get(['id']);

        $rows = $users->map(fn (User $user) => [
            'user_id' => $user->id,
            'type' => 'pengumuman',
            'title' => $title,
            'message' => $message,
            'report_id' => null,
            'is_read' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($rows->isNotEmpty()) {
            AppNotification::insert($rows->toArray());
        }
    }
}