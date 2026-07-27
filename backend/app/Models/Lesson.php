<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = ['course_id', 'title', 'content', 'video_url', 'order', 'duration_min'];

    public function course() { return $this->belongsTo(Course::class); }
    public function comments() { return $this->morphMany(Comment::class, 'commentable'); }
}
