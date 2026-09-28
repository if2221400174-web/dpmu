<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keputusan extends Model
{
    protected $table = 'keputusans';

    protected $fillable= [
        'judul', 'abstract', 'file' ,'status', 'tanggal_ditetapkan'
    ];
}
