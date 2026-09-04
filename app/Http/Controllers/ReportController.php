<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Models\Category;
use App\Models\Report;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Report/Create', [
            'categories' => Category::where('is_active', true)
                ->select('id', 'name')
                ->get(),
        ]);
    }

    public function store(StoreReportRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $report = Report::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'is_anonymous' => $validated['is_anonymous'] ?? false,
            'status' => 'terkirim',
        ]);

        // Simpan lampiran kalau ada
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('report-attachments', 'public');

                $report->attachments()->create([
                    'file_path' => $path,
                    'file_type' => str_starts_with($file->getMimeType(), 'image') ? 'image' : 'video',
                ]);
            }
        }

        // Catat riwayat status pertama
        $report->statusHistories()->create([
            'status' => 'terkirim',
            'note' => 'Aduan berhasil dikirim.',
            'changed_by' => null,
        ]);

        NotificationService::newReportSubmitted($report);

        return redirect()
            ->route('reports.index')
            ->with('success', "Aduan berhasil dikirim dengan kode {$report->code}");
    }

    public function index(): Response
    {
        $reports = Report::where('user_id', request()->user()->id)
            ->with('category')
            ->latest()
            ->get();

        return Inertia::render('Report/Index', [
            'reports' => $reports,
        ]);
    }
}