<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationSettingController extends Controller
{
    /**
     * Halaman "Pengaturan Notifikasi" — per user, bukan global.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return inertia('NotificationSettings', [
            'settings' => [
                'notify_new_report' => $user->notify_new_report,
                'notify_report_responded' => $user->notify_report_responded,
                'notify_status_changed' => $user->notify_status_changed,
                'notify_report_completed' => $user->notify_report_completed,
                'notify_pengumuman' => $user->notify_pengumuman,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'notify_new_report' => ['required', 'boolean'],
            'notify_report_responded' => ['required', 'boolean'],
            'notify_status_changed' => ['required', 'boolean'],
            'notify_report_completed' => ['required', 'boolean'],
            'notify_pengumuman' => ['required', 'boolean'],
        ]);

        $request->user()->update($validated);

        return back();
    }
}