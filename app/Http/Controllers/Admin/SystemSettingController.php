<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    public function index(): Response
    {
        $settings = SystemSetting::pluck('value', 'key');

        $fileUrl = fn (?string $path) => $path ? Storage::url($path) : null;

        return Inertia::render('Admin/System/Settings', [
            'settings' => [
                'system_name'    => $settings->get('system_name', ''),
                'school_name'    => $settings->get('school_name', ''),
                'tagline'        => $settings->get('tagline', ''),
                'contact_email'  => $settings->get('contact_email', ''),
                'contact_phone'  => $settings->get('contact_phone', ''),
                'school_address' => $settings->get('school_address', ''),

                // Untuk file: kirim URL yang bisa ditampilkan langsung sebagai preview,
                // bukan path mentah di storage.
                'logo_siap_url'    => $fileUrl($settings->get('logo_siap')),
                'logo_sekolah_url' => $fileUrl($settings->get('logo_sekolah')),
                'favicon_url'      => $fileUrl($settings->get('favicon')),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'system_name'    => 'required|string|max:255',
            'school_name'    => 'required|string|max:255',
            'tagline'        => 'nullable|string|max:255',
            'contact_email'  => 'nullable|email|max:255',
            'contact_phone'  => 'nullable|string|max:50',
            'school_address' => 'nullable|string|max:500',

            'logo_siap'    => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048', // maks 2MB
            'logo_sekolah' => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048', // maks 2MB
            'favicon'      => 'nullable|file|mimes:ico,png,jpg,jpeg,svg|max:2048', // maks 2MB

            'remove_logo_siap'    => 'nullable|boolean',
            'remove_logo_sekolah' => 'nullable|boolean',
            'remove_favicon'      => 'nullable|boolean',
        ]);

        // Field teks biasa
        foreach (['system_name', 'school_name', 'tagline', 'contact_email', 'contact_phone', 'school_address'] as $key) {
            SystemSetting::set($key, $validated[$key] ?? '');
        }

        // Field file: logo_siap, logo_sekolah, favicon — masing-masing bisa diganti (upload baru)
        // atau dihapus (tombol "Hapus" di frontend, tanpa upload baru).
        foreach (SystemSetting::FILE_KEYS as $key) {
            $removeFlag = $request->boolean("remove_{$key}");
            $oldPath = SystemSetting::get($key);

            if ($request->hasFile($key)) {
                if ($oldPath) {
                    Storage::disk('public')->delete($oldPath);
                }
                $folder = $key === 'favicon' ? 'system/favicon' : 'system/logos';
                SystemSetting::set($key, $request->file($key)->store($folder, 'public'));
            } elseif ($removeFlag && $oldPath) {
                Storage::disk('public')->delete($oldPath);
                SystemSetting::set($key, null);
            }
        }

        return redirect()->back()->with('success', 'Pengaturan sistem berhasil disimpan.');
    }
}