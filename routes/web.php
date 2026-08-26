<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\Admin\LandingStatController;
use App\Http\Controllers\Admin\LandingSettingController;
use App\Http\Controllers\Admin\LandingFaqController;
use App\Http\Controllers\Admin\LandingStepController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [LandingController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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
});

require __DIR__.'/auth.php';