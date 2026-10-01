<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeritaDpm extends Model
{
    protected $table = 'berita_dpms';

    protected $fillable = [
        'judul',
        'isi_berita',
        'deskripsi_foto',
        'foto_berita',
        'tanggal_terbit',
    ];
}
