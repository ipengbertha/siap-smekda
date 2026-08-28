<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'user_id',
        'type',
        'category_id',
        'destination_id',
        'title',
        'description',
        'status',
        'priority',
        'is_anonymous',
        'is_featured', 
        'reporter_name',
        'reporter_contact',
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'is_featured' => 'boolean', // tambahkan ini
    ];

    // Generate kode otomatis (ADU-2026-00125) setiap kali report baru dibuat
    protected static function booted(): void
    {
        static::creating(function (Report $report) {
            $year = now()->year;
            $prefix = $report->type === 'aspirasi' ? 'ASP' : 'ADU';

            $attempts = 0;
            do {
                $randomNumber = str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);
                $code = "{$prefix}-{$year}-{$randomNumber}";
                $attempts++;
            } while (static::where('code', $code)->exists() && $attempts < 5);

            $report->code = $code;
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ReportAttachment::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ReportStatusHistory::class)->orderBy('created_at');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(ReportResponse::class)->orderBy('created_at');
    }

    public function rating(): HasOne
    {
        return $this->hasOne(ReportRating::class);
    }
}