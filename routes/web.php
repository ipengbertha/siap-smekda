<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\Admin\LandingStatController;
use App\Http\Controllers\Admin\LandingSettingController;
use App\Http\Controllers\Admin\LandingFaqController;
use App\Http\Controllers\Admin\LandingStepController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\BannedWordController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\ReportResponseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [LandingController::class, 'index'])->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/aduan', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/aduan/buat', [ReportController::class, 'create'])->name('reports.create');
    Route::post('/aduan', [ReportController::class, 'store'])->name('reports.store');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/landing/settings', [LandingSettingController::class, 'index'])->name('landing.settings');
    Route::put('/landing/settings', [LandingSettingController::class, 'update'])->name('landing.settings.update');

    // Tambahkan blok ini:
    Route::get('/landing/stats', [LandingStatController::class, 'index'])->name('landing.stats');
    Route::post('/landing/stats', [LandingStatController::class, 'store'])->name('landing.stats.store');
    Route::put('/landing/stats/{stat}', [LandingStatController::class, 'update'])->name('landing.stats.update');
    Route::delete('/landing/stats/{stat}', [LandingStatController::class, 'destroy'])->name('landing.stats.destroy');
    Route::post('/landing/stats/reorder', [LandingStatController::class, 'reorder'])->name('landing.stats.reorder');

    Route::get('/landing/faqs', [LandingFaqController::class, 'index'])->name('landing.faqs');
    Route::post('/landing/faqs', [LandingFaqController::class, 'store'])->name('landing.faqs.store');
    Route::put('/landing/faqs/{faq}', [LandingFaqController::class, 'update'])->name('landing.faqs.update');
    Route::delete('/landing/faqs/{faq}', [LandingFaqController::class, 'destroy'])->name('landing.faqs.destroy');
    Route::post('/landing/faqs/reorder', [LandingFaqController::class, 'reorder'])->name('landing.faqs.reorder');

    Route::get('/landing/steps', [LandingStepController::class, 'index'])->name('landing.steps');
    Route::post('/landing/steps', [LandingStepController::class, 'store'])->name('landing.steps.store');
    Route::put('/landing/steps/{step}', [LandingStepController::class, 'update'])->name('landing.steps.update');
    Route::delete('/landing/steps/{step}', [LandingStepController::class, 'destroy'])->name('landing.steps.destroy');
    Route::post('/landing/steps/reorder', [LandingStepController::class, 'reorder'])->name('landing.steps.reorder');

    // Kelola Kategori Aduan
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::patch('/categories/{category}/toggle-active', [CategoryController::class, 'toggleActive'])->name('categories.toggle-active');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Kelola Tujuan
    Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations.index');
    Route::post('/destinations', [DestinationController::class, 'store'])->name('destinations.store');
    Route::put('/destinations/{destination}', [DestinationController::class, 'update'])->name('destinations.update');
    Route::patch('/destinations/{destination}/toggle-active', [DestinationController::class, 'toggleActive'])->name('destinations.toggle-active');
    Route::delete('/destinations/{destination}', [DestinationController::class, 'destroy'])->name('destinations.destroy');

    // Kelola Kata Terlarang
    Route::get('/banned-words', [BannedWordController::class, 'index'])->name('banned-words.index');
    Route::post('/banned-words', [BannedWordController::class, 'store'])->name('banned-words.store');
    Route::put('/banned-words/{bannedWord}', [BannedWordController::class, 'update'])->name('banned-words.update');
    Route::patch('/banned-words/{bannedWord}/toggle-active', [BannedWordController::class, 'toggleActive'])->name('banned-words.toggle-active');
    Route::delete('/banned-words/{bannedWord}', [BannedWordController::class, 'destroy'])->name('banned-words.destroy');

    // Kelola User
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/status', [UserController::class, 'updateStatus'])->name('users.update-status');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Kelola Aduan
    Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{report}', [AdminReportController::class, 'show'])->name('reports.show');
    Route::patch('/reports/{report}/status', [AdminReportController::class, 'updateStatus'])->name('reports.update-status');
    Route::delete('/reports/{report}', [AdminReportController::class, 'destroy'])->name('reports.destroy');
    Route::post('/reports/{report}/responses', [ReportResponseController::class, 'store'])->name('reports.responses.store');

    // Kelola Tanggapan (global)
    Route::get('/responses', [ReportResponseController::class, 'index'])->name('responses.index');
    Route::put('/responses/{response}', [ReportResponseController::class, 'update'])->name('responses.update');
    Route::delete('/responses/{response}', [ReportResponseController::class, 'destroy'])->name('responses.destroy');
});

Route::get('/track', [TrackController::class, 'index'])->name('track.index');
Route::get('/track/{code}', [TrackController::class, 'show'])->name('track.show');

require __DIR__.'/auth.php';