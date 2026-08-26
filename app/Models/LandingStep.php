<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingStep extends Model
{
    protected $fillable = ['title', 'description', 'order'];
}