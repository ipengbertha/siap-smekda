<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use App\Models\Category;
use App\Models\Report;
use App\Models\ReportSetting;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            'settings' => [
                'allow_anonymous' => filter_var(ReportSetting::get('report_allow_anonymous', true), FILTER_VALIDATE_BOOLEAN),
                'max_attachment_count' => (int) ReportSetting::get('report_max_attachment_count', 5),
                'max_attachment_size_kb' => (int) ReportSetting::get('report_max_attachment_size_kb', 10240),
                'allowed_attachment_formats' => ReportSetting::get('report_allowed_attachment_formats', 'jpg,jpeg,png,mp4,mov'),
            ],
        ]);
    }

    public function store(StoreReportRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $allowAnonymous = filter_var(ReportSetting::get('report_allow_anonymous', true), FILTER_VALIDATE_BOOLEAN);

        $report = Report::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            // Kalau admin matiin opsi anonim, paksa false meski request-nya kirim true
            'is_anonymous' => $allowAnonymous ? ($validated['is_anonymous'] ?? false) : false,
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

        $canEdit = filter_var(ReportSetting::get('report_allow_edit', true), FILTER_VALIDATE_BOOLEAN);
        $canDelete = filter_var(ReportSetting::get('report_allow_delete', true), FILTER_VALIDATE_BOOLEAN);

        return Inertia::render('Report/Index', [
            'reports' => $reports->map(fn (Report $report) => [
                ...$report->toArray(),
                'can_edit' => $canEdit && $report->status === 'terkirim',
                'can_delete' => $canDelete && $report->status === 'terkirim',
            ]),
        ]);
    }

    public function edit(Request $request, Report $report): Response
    {
        $this->authorizeOwnerEdit($request, $report, 'report_allow_edit');

        return Inertia::render('Report/Edit', [
            'report' => $report->load('attachments')->toArray(),
            'categories' => Category::where('is_active', true)
                ->select('id', 'name')
                ->get(),
            'settings' => [
                'allow_anonymous' => filter_var(ReportSetting::get('report_allow_anonymous', true), FILTER_VALIDATE_BOOLEAN),
                'max_attachment_count' => (int) ReportSetting::get('report_max_attachment_count', 5),
                'max_attachment_size_kb' => (int) ReportSetting::get('report_max_attachment_size_kb', 10240),
                'allowed_attachment_formats' => ReportSetting::get('report_allowed_attachment_formats', 'jpg,jpeg,png,mp4,mov'),
            ],
        ]);
    }

    public function update(UpdateReportRequest $request, Report $report): RedirectResponse
    {
        $this->authorizeOwnerEdit($request, $report, 'report_allow_edit');

        $validated = $request->validated();
        $allowAnonymous = filter_var(ReportSetting::get('report_allow_anonymous', true), FILTER_VALIDATE_BOOLEAN);

        // Hapus lampiran lama yang ditandai user untuk dihapus (harus tetap punya laporan ini)
        if (! empty($validated['removed_attachment_ids'])) {
            $toRemove = $report->attachments()->whereIn('id', $validated['removed_attachment_ids'])->get();
            foreach ($toRemove as $attachment) {
                Storage::disk('public')->delete($attachment->file_path);
                $attachment->delete();
            }
        }

        $maxCount = (int) ReportSetting::get('report_max_attachment_count', 5);
        $existingCount = $report->attachments()->count();
        $newCount = $request->hasFile('attachments') ? count($request->file('attachments')) : 0;

        if ($existingCount + $newCount > $maxCount) {
            return redirect()->back()
                ->withErrors(['attachments' => "Total lampiran tidak boleh lebih dari {$maxCount}."])
                ->withInput();
        }

        $report->update([
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'is_anonymous' => $allowAnonymous ? ($validated['is_anonymous'] ?? false) : false,
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('report-attachments', 'public');

                $report->attachments()->create([
                    'file_path' => $path,
                    'file_type' => str_starts_with($file->getMimeType(), 'image') ? 'image' : 'video',
                ]);
            }
        }

        return redirect()
            ->route('reports.index')
            ->with('success', 'Aduan berhasil diperbarui.');
    }

    public function destroy(Request $request, Report $report): RedirectResponse
    {
        $this->authorizeOwnerEdit($request, $report, 'report_allow_delete');

        foreach ($report->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $report->delete();

        return redirect()
            ->route('reports.index')
            ->with('success', 'Aduan berhasil dihapus.');
    }

    /**
     * Pastikan hanya pemilik aduan yang bisa edit/hapus, hanya selagi status masih
     * 'terkirim' (belum disentuh admin), dan hanya kalau admin masih mengizinkan
     * lewat Pengaturan Aduan. Dilempar sebagai 403 kalau salah satu syarat gagal.
     */
    protected function authorizeOwnerEdit(Request $request, Report $report, string $settingKey): void
    {
        abort_unless($report->user_id === $request->user()->id, 403, 'Kamu tidak punya akses ke aduan ini.');
        abort_unless($report->status === 'terkirim', 403, 'Aduan yang sudah diproses admin tidak bisa diubah/dihapus lagi.');
        abort_unless(
            filter_var(ReportSetting::get($settingKey, true), FILTER_VALIDATE_BOOLEAN),
            403,
            'Fitur ini sedang dinonaktifkan oleh admin.'
        );
    }
}