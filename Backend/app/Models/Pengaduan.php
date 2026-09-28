<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengaduan extends Model
{
    protected $table = 'pengaduans';

    protected $fillable= [
        'prodi', 'fakultas', 'deskripsi_masalah', 'foto_bukti'
    ];
}
