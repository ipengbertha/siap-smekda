<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Destination;
use App\Models\Report;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public const STATUSES = [
        'terkirim',
        'diterima',
        'diproses',
        'ditanggapi',
        'selesai',
        'ditolak',
        'diblokir',
    ];

    public function index(Request $request): Response
    {
        $reports = Report::query()
            ->with(['category:id,name', 'destination:id,name', 'user:id,name'])
            ->withCount('responses')
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->category_id, fn ($q) => $q->where('category_id', $request->category_id))
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($sub) use ($request) {
                    $sub->where('code', 'like', "%{$request->search}%")
                        ->orWhere('title', 'like', "%{$request->search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'statuses' => self::STATUSES,
            'filters' => $request->only(['status', 'category_id', 'search']),
        ]);
    }

    public function show(Report $report): Response
    {
        $report->load([
            'category:id,name',
            'destination:id,name',
            'user:id,name,email',
            'attachments',
            'statusHistories.changedBy:id,name',
            'responses.user:id,name',
        ]);

        return Inertia::render('Admin/Reports/Show', [
            'report' => $report,
            'destinations' => Destination::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'statuses' => self::STATUSES,
        ]);
    }

    public function updateStatus(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:' . implode(',', self::STATUSES)],
            'note' => ['nullable', 'string', 'max:1000'],
            'destination_id' => ['nullable', 'exists:destinations,id'],
        ]);

        $statusChanged = $report->status !== $validated['status'];

        $report->update([
            'status' => $validated['status'],
            'destination_id' => $validated['destination_id'] ?? $report->destination_id,
        ]);

        $report->statusHistories()->create([
            'status' => $validated['status'],
            'note' => $validated['note'] ?? null,
            'changed_by' => $request->user()->id,
        ]);

        // Cuma kirim notif kalau statusnya beneran berubah — hindari spam kalau
        // admin klik simpan tanpa ganti status (mis. cuma mau nambah note/destination).
        if ($statusChanged) {
            NotificationService::reportStatusChanged($report, $validated['status']);
        }

        return redirect()->back()->with('success', 'Status aduan berhasil diperbarui.');
    }

    public function destroy(Report $report): RedirectResponse
    {
        $report->delete();

        return redirect()->route('admin.reports.index')->with('success', 'Aduan berhasil dihapus.');
    }
}
