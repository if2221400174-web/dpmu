<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('berita_dpms', function (Blueprint $table) {
            // Menambahkan kolom tanggal_terbit (boleh kosong / nullable)
            $table->dateTime('tanggal_terbit')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berita_dpms', function (Blueprint $table) {
            // Menghapus kolom jika di-rollback
            $table->dropColumn('tanggal_terbit');
        });
    }
};
