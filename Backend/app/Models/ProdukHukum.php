<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdukHukum extends Model
{
    protected $table = 'produk_hukums';

    protected $fillable= [
        'judul', 'abstract', 'file', 'status', 'tanggal_ditetapkan'
    ];
}
