<?php

namespace Database\Seeders;

use App\Models\TentangDpm;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TentangDpmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TentangDpm::create(attributes: [
            'tujuan' => 'a',
            'fungsi' => 'b',
            'visi' => 'c',
            'misi' => 'd',
        ]);
    }
}
