<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportRating extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'rating',
        'is_resolved',
        'comment',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }
}