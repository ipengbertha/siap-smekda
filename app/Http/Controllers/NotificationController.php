<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Daftar notifikasi milik user (dipakai kalau nanti ada halaman "Semua Notifikasi").
     */
    public function index(Request $request)
    {
        $notifications = AppNotification::query()
            ->visibleTo($request->user())
            ->latest()
            ->paginate(20);

        return inertia('Notification/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Tandai satu notifikasi sudah dibaca.
     *
     * Catatan: notifikasi broadcast (user_id null, tipe "pengumuman") sengaja TIDAK
     * diubah is_read-nya di sini — kolom itu dipakai bareng semua user, jadi kalau
     * ditandai dibaca, otomatis "dibaca" juga buat user lain. Untuk sekarang,
     * broadcast selalu ditampilkan sebagai info (tidak masuk hitungan badge).
     */
    public function read(Request $request, AppNotification $notification): RedirectResponse
    {
        abort_unless(
            $notification->user_id === $request->user()->id,
            403
        );

        $notification->update(['is_read' => true]);

        return back();
    }

    /**
     * Tandai semua notifikasi pribadi user ini sudah dibaca.
     */
    public function readAll(Request $request): RedirectResponse
    {
        AppNotification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back();
    }
}