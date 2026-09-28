<?php

namespace Database\Seeders;

use App\Models\StrukturDpm;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StrukturDpmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        StrukturDpm::create([
            'nama' => 'John Doe',
            'jabatan' => 'Ketua',
            'foto' => 'johndoe.jpg'  
        ]);
    }
}
