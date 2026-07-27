<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    protected $fillable = ['title', 'description', 'host_id', 'google_meet_url', 'recording_url', 'scheduled_at', 'status'];

    protected function casts(): array
    {
        return ['scheduled_at' => 'datetime'];
    }

    public function host() { return $this->belongsTo(User::class, 'host_id'); }
}
