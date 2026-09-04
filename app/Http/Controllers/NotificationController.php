<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Halaman "Semua Notifikasi" — daftar lengkap & berpaginasi milik user ini.
     */
    public function index(Request $request)
    {
        $notifications = AppNotification::query()
            ->visibleTo($request->user())
            ->with('report:id,code')
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(function (AppNotification $n) {
                $isBroadcast = is_null($n->user_id);

                return [
                    'id' => $n->id,
                    'type' => $n->type,
                    'title' => $n->title,
                    'message' => $n->message,
                    'report_id' => $n->report?->id,
                    'report_code' => $n->report?->code,
                    'is_read' => $isBroadcast ? true : $n->is_read,
                    'is_broadcast' => $isBroadcast,
                    'created_at' => $n->created_at->diffForHumans(),
                ];
            });

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