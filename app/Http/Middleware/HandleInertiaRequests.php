<?php

namespace App\Http\Middleware;

use App\Models\AppNotification;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'notifications' => $user ? $this->notificationsFor($user) : null,
            'systemSettings' => $this->systemSettings(),
        ];
    }

    /**
     * Identitas sistem (nama, nama sekolah, logo) dishare ke semua halaman
     * supaya sidebar/footer/dsb bisa pakai logo yang diupload admin,
     * bukan file statis yang di-hardcode.
     */
    protected function systemSettings(): array
    {
        $settings = SystemSetting::pluck('value', 'key');
        $fileUrl = fn (?string $path) => $path ? Storage::url($path) : null;

        return [
            'system_name' => $settings->get('system_name', 'SIAP SMEKDA'),
            'school_name' => $settings->get('school_name', ''),
            'tagline'     => $settings->get('tagline', ''),
            'logo_siap_url'    => $fileUrl($settings->get('logo_siap')),
            'logo_sekolah_url' => $fileUrl($settings->get('logo_sekolah')),
        ];
    }

    /**
     * Ringkasan notifikasi buat lonceng di UserLayout: jumlah belum dibaca
     * (cuma dihitung dari notif pribadi) + beberapa notif terbaru (pribadi + broadcast).
     */
    protected function notificationsFor($user): array
    {
        $unreadCount = AppNotification::query()
            ->where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        $items = AppNotification::query()
            ->visibleTo($user)
            ->with('report:id,code')
            ->latest()
            ->take(8)
            ->get()
            ->map(function (AppNotification $n) {
                $isBroadcast = is_null($n->user_id);

                return [
                    'id' => $n->id,
                    'type' => $n->type,
                    'title' => $n->title,
                    'message' => $n->message,
                    'report_id' => $n->report?->id,
                    'report_code' => $n->report?->code,
                    // broadcast nggak punya status baca per-user, jadi ditampilkan
                    // sebagai info biasa (bukan "belum dibaca").
                    'is_read' => $isBroadcast ? true : $n->is_read,
                    'is_broadcast' => $isBroadcast,
                    'created_at' => $n->created_at->diffForHumans(),
                ];
            });

        return [
            'unread_count' => $unreadCount,
            'items' => $items,
        ];
    }
}