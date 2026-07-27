<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role', 'avatar', 'bio', 'locale'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function articles() { return $this->hasMany(Article::class, 'author_id'); }
    public function courses()  { return $this->hasMany(Course::class, 'teacher_id'); }
    public function meetings() { return $this->hasMany(Meeting::class, 'host_id'); }

    public function isAdmin()      { return $this->role === 'admin'; }
    public function isTeacher()    { return $this->role === 'teacher'; }
    public function isResearcher() { return $this->role === 'researcher'; }
    public function canPublish()   { return in_array($this->role, ['admin', 'teacher', 'researcher']); }
}
