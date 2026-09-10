<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Kunci-kunci setting yang berisi path file (logo/favicon), bukan teks biasa.
     * Dipakai controller untuk tahu kunci mana yang perlu dihapus filenya dari storage
     * saat diganti atau dihapus.
     */
    public const FILE_KEYS = ['logo_siap', 'logo_sekolah', 'favicon'];

    public static function get(string $key, $default = null)
    {
        return static::where('key', $key)->value('value') ?? $default;
    }

    public static function set(string $key, $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}