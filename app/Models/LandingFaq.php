<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingFaq extends Model
{
    protected $fillable = ['question', 'answer', 'order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}