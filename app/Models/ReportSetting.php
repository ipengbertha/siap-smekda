<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportSetting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, $default = null)
    {
        return static::where('key', $key)->value('value') ?? $default;
    }

    public static function set(string $key, $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /**
     * 7 status aduan yang fixed di kode (bukan admin bebas nambah/ubah nama status),
     * karena banyak logic bisnis (dashboard, sorotan publik, dst) bergantung ke nilai-nilai ini.
     * Admin cuma bisa nyala/matiin mana yang aktif dipakai lewat report_disabled_statuses.
     */
    public const AVAILABLE_STATUSES = [
        'terkirim',
        'diterima',
        'diproses',
        'ditanggapi',
        'selesai',
        'ditolak',
        'diblokir',
    ];

    public static function disabledStatuses(): array
    {
        $raw = static::get('report_disabled_statuses', '[]');
        $decoded = json_decode($raw, true);

        return is_array($decoded) ? array_values(array_intersect($decoded, self::AVAILABLE_STATUSES)) : [];
    }

    public static function activeStatuses(): array
    {
        return array_values(array_diff(self::AVAILABLE_STATUSES, self::disabledStatuses()));
    }
}