<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    protected $guarded = [];

    protected $casts = [
        'missions_fr' => 'array',
        'missions_en' => 'array',
    ];
}
