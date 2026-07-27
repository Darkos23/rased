<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

// Auth (public)
Route::post('/auth/register',         [AuthController::class, 'register']);
Route::post('/auth/login',            [AuthController::class, 'login']);
Route::post('/auth/forgot-password',  [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password',   [AuthController::class, 'resetPassword']);
Route::get('/auth/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');

// Traduction (public)
Route::post('/translate', [TranslationController::class, 'translate']);

// Articles (lecture publique)
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);

// Cours (lecture publique)
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{slug}', [CourseController::class, 'show']);

// Réunions (lecture publique)
Route::get('/meetings', [MeetingController::class, 'index']);
Route::get('/meetings/{id}', [MeetingController::class, 'show']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {

    // Uploads
    Route::post('/uploads/thumbnail', [UploadController::class, 'thumbnail']);

    // Vérification email (renvoyer)
    Route::post('/auth/email/resend', [AuthController::class, 'resendVerification']);

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/users/me', [UserController::class, 'me']);
    Route::put('/users/me', [UserController::class, 'update']);
    Route::put('/users/me/password', [UserController::class, 'changePassword']);
    Route::post('/users/me/avatar', [UserController::class, 'uploadAvatar']);

    // Articles (écriture : teacher/admin)
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

    // Cours (écriture : teacher/admin)
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    // Leçons
    Route::get('/courses/{id}/lessons', [LessonController::class, 'byCourse']);
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);

    // Réunions (écriture : teacher/admin)
    Route::post('/meetings', [MeetingController::class, 'store']);
    Route::put('/meetings/{id}', [MeetingController::class, 'update']);
    Route::delete('/meetings/{id}', [MeetingController::class, 'destroy']);
    Route::patch('/meetings/{id}/recording', [MeetingController::class, 'addRecording']);
    Route::get('/meetings/{id}/token', [MeetingController::class, 'token']);

    // Dashboard
    Route::get('/dashboard', [UserController::class, 'dashboard']);

    // Admin : gestion des utilisateurs
    Route::get('/admin/users', [UserController::class, 'listUsers']);
    Route::put('/admin/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroyUser']);
});
