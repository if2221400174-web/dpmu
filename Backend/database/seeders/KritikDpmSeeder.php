<?php

namespace Database\Seeders;

use App\Models\KritikDpm;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KritikDpmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        KritikDpm::create([
            'kritik' => 'Ketua tidak beccus',
            'saran' => 'Segera evaluasi'
        ]);
    }
}
