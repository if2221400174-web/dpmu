<?php

namespace Database\Seeders;

use App\Models\ProdukHukum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProdukHukumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProdukHukum::create([
            'judul' => 'UU Orama',
            'abstract' => 'Undang-Undang tentang Organisasi Kemahasiswaan (UU Ormawa) adalah peraturan yang mengatur pembentukan, struktur, fungsi, dan kegiatan organisasi kemahasiswaan di lingkungan perguruan tinggi. UU ini bertujuan untuk memberikan landasan hukum bagi organisasi kemahasiswaan agar dapat beroperasi secara efektif dan sesuai dengan prinsip-prinsip demokrasi, otonomi, dan partisipasi mahasiswa dalam kehidupan kampus. UU Ormawa juga mengatur hak dan kewajiban mahasiswa dalam berorganisasi, serta mekanisme pengawasan dan evaluasi terhadap kinerja organisasi kemahasiswaan.',
            'file' => 'UU_Ormawa.pdf',
            'status' => 'Berlaku',
            'tanggal_ditetapkan' => '2025-12-03'
        ]);
    }
}
