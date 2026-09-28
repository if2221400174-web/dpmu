<?php

namespace Database\Seeders;

use App\Models\Pengaduan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PengaduanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pengaduan::create([
            'prodi' => 'Informatika',
            'fakultas' => 'Teknik',
            'deskripsi_masalah' => 'Pagar Rusak',
            'foto_bukti' => 'pagar.jpg'
        ]);
    }
}
