<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'user_id',
        'message',
        'is_admin',
        'is_featured',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}