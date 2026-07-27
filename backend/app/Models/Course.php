<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['title', 'slug', 'description', 'thumbnail', 'level', 'status', 'teacher_id'];

    public function teacher() { return $this->belongsTo(User::class, 'teacher_id'); }
    public function lessons() { return $this->hasMany(Lesson::class)->orderBy('order'); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
}
