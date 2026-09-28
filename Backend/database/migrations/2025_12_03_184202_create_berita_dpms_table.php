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
        Schema::create('berita_dpms', function (Blueprint $table) {
            $table->id();
            $table->text('judul');
            $table->text('isi_berita');
            $table->text('deskripsi_foto');
            $table->string('foto_berita');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berita_dpms');
    }
};
