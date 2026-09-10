<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Halaman form "Buat Pengumuman". Sengaja tidak ada daftar riwayat pengumuman
     * di sini — pengumuman langsung disebar jadi notifikasi per user begitu dikirim,
     * jadi tidak ada satu baris "master" yang bisa ditampilkan sebagai riwayat.
     */
    public function create()
    {
        return inertia('Admin/Announcements/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        NotificationService::announcementCreated($validated['title'], $validated['message']);

        return redirect()->route('admin.announcements.create');
    }
}