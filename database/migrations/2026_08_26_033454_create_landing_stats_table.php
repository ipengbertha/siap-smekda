<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_stats', function (Blueprint $table) {
            $table->id();
            $table->string('label'); // "Total Aduan"
            $table->string('value'); // "1.245" — string, bukan integer, karena bisa ada format "76%"
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_stats');
    }
};