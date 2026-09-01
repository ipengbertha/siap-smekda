<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ubah kolom status dari enum tetap menjadi string bebas supaya bisa
     * menampung status baru (diterima, ditanggapi, diblokir) tanpa perlu
     * migration ulang tiap kali admin butuh status baru.
     */
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->string('status')->default('terkirim')->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->enum('status', [
                'terkirim',
                'diverifikasi',
                'diproses',
                'ditindaklanjuti',
                'selesai',
                'ditolak',
            ])->default('terkirim')->after('description');
        });
    }
};
