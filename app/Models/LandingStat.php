<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingStat extends Model
{
    protected $fillable = ['label', 'value', 'order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}