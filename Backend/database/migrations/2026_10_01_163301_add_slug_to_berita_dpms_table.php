<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('berita_dpms', function (Blueprint $table) {
            // Menambahkan kolom slug setelah judul
            $table->string('slug')->nullable()->after('judul');
        });
    }

    public function down(): void
    {
        Schema::table('berita_dpms', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
