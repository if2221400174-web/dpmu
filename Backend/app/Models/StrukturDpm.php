<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StrukturDpm extends Model
{
    protected $table = 'struktur_dpms';

    protected $fillable = [
        'nama',
        'jabatan',
        'foto',
    ];
}
