<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this ->call([
            UserSeeder::class,
            ProdukHukumSeeder::class,
            KeputusanSeeder::class,
            BeritaDpmSeeder::class,
            KritikDpmSeeder::class,
            PengaduanSeeder::class,
            StrukturDpmSeeder::class,
            TentangDpmSeeder::class
        ]);
    }
}
