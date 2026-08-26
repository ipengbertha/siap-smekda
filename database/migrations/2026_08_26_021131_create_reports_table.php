<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // ADU-2026-00125

            // nullable karena bisa dikirim non-login/anonim
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            $table->enum('type', ['aduan', 'aspirasi'])->default('aduan');

            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('destination_id')->nullable()->constrained()->nullOnDelete();

            $table->string('title');
            $table->text('description');

            $table->enum('status', [
                'terkirim',
                'diverifikasi',
                'diproses',
                'ditindaklanjuti',
                'selesai',
                'ditolak',
            ])->default('terkirim');

            $table->enum('priority', ['rendah', 'sedang', 'tinggi'])->nullable();

            $table->boolean('is_anonymous')->default(false);

            // dipakai kalau non-login, buat identitas opsional tanpa akun
            $table->string('reporter_name')->nullable();
            $table->string('reporter_contact')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};