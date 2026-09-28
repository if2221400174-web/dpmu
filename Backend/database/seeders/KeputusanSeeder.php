<?php

namespace Database\Seeders;

use App\Models\Keputusan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KeputusanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Keputusan::create([
            'judul' => 'Pemberhentian',
            'abstract' => 'Keputusan tentang pemberhentian anggota organisasi mahasiswa.',
            'status' => 'Berlaku',
            'tanggal_ditetapkan' => '2025-11-15',
            'file' => 'Pemberhentian.pdf'
        ]);
    }
}
