<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TentangDpm extends Model
{
    protected $table = 'tentang_dpms';

    protected $fillable= [
        'tujuan', 'fungsi', 'visi', 'misi'
    ];
}
