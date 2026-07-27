<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = ['title', 'slug', 'body', 'thumbnail', 'status', 'category', 'lang', 'author_id'];

    public function author() { return $this->belongsTo(User::class, 'author_id'); }
    public function comments() { return $this->morphMany(Comment::class, 'commentable'); }
}
