<?php

namespace Database\Seeders;

use App\Models\BeritaDpm;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BeritaDpmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BeritaDpm::create([
            'judul' => 'A',
            'isi_berita' => 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'deskripsi_foto' => 'a',
            'foto_berita' => 'a.jpg'
        ]);
    }
}
