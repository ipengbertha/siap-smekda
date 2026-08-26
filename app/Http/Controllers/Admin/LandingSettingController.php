<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingSettingController extends Controller
{
    public function index(): Response
    {
        $settings = LandingSetting::pluck('value', 'key');

        return Inertia::render('Admin/Landing/Settings', [
            'settings' => [
                'hero_title'    => $settings->get('hero_title', ''),
                'hero_subtitle' => $settings->get('hero_subtitle', ''),

                'footer_copyright' => $settings->get('footer_copyright', ''),
                'footer_email'     => $settings->get('footer_email', ''),
                'footer_phone'     => $settings->get('footer_phone', ''),
                'footer_address'   => $settings->get('footer_address', ''),

                'social_instagram' => $settings->get('social_instagram', ''),
                'social_facebook'  => $settings->get('social_facebook', ''),
                'social_youtube'   => $settings->get('social_youtube', ''),
                'social_whatsapp'  => $settings->get('social_whatsapp', ''),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_title'    => 'required|string|max:255',
            'hero_subtitle' => 'required|string|max:500',

            'footer_copyright' => 'required|string|max:255',
            'footer_email'     => 'nullable|email|max:255',
            'footer_phone'     => 'nullable|string|max:50',
            'footer_address'   => 'nullable|string|max:500',

            'social_instagram' => 'nullable|url|max:255',
            'social_facebook'  => 'nullable|url|max:255',
            'social_youtube'   => 'nullable|url|max:255',
            'social_whatsapp'  => 'nullable|string|max:50', // nomor WA, bukan URL
        ]);

        foreach ($validated as $key => $value) {
            LandingSetting::set($key, $value ?? '');
        }

        return redirect()->back()->with('success', 'Pengaturan landing page berhasil disimpan.');
    }
}