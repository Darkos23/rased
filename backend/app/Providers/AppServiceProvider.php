<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Le lien de réinitialisation pointe vers le frontend Next.js
        ResetPassword::createUrlUsing(function ($notifiable, string $token): string {
            $base = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
            return $base . '/reset-password?token=' . $token . '&email=' . urlencode($notifiable->email);
        });

        // Le lien de vérification email pointe vers le frontend Next.js
        VerifyEmail::createUrlUsing(function ($notifiable): string {
            $base    = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
            $id      = $notifiable->getKey();
            $hash    = sha1($notifiable->getEmailForVerification());
            $expires = now()->addHours(24)->timestamp;
            return $base . '/verify-email/' . $id . '/' . $hash . '?expires=' . $expires;
        });
    }
}
