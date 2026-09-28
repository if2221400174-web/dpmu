<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KritikDpm extends Model
{
    protected $table = 'kritik_dpms';

    protected $fillable= [
        'kritik', 'saran'
    ];
}
