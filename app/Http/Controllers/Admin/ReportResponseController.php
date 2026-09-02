<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportResponseController extends Controller
{
    public function index(Request $request): Response
    {
        $responses = ReportResponse::query()
            ->with(['report:id,code,title,status', 'user:id,name'])
            ->when($request->search, function ($q) use ($request) {
                $q->where('message', 'like', "%{$request->search}%")
                    ->orWhereHas('report', fn ($sub) => $sub->where('code', 'like', "%{$request->search}%"));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Responses/Index', [
            'responses' => $responses,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request, Report $report): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:3', 'max:2000'],
            'is_internal' => ['nullable', 'boolean'],
        ]);

        $isInternal = $validated['is_internal'] ?? false;

        $report->responses()->create([
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'is_admin' => true,
            'is_internal' => $isInternal,
        ]);

        // Catatan internal nggak mengubah status aduan atau riwayat status,
        // karena pelapor nggak melihat catatan ini sama sekali.
        if (! $isInternal && ! in_array($report->status, ['selesai', 'ditolak', 'diblokir'], true)) {
            $report->update(['status' => 'ditanggapi']);

            $report->statusHistories()->create([
                'status' => 'ditanggapi',
                'note' => 'Admin memberikan tanggapan.',
                'changed_by' => $request->user()->id,
            ]);
        }

        return redirect()->back()->with(
            'success',
            $isInternal ? 'Catatan internal tersimpan.' : 'Tanggapan berhasil dikirim.'
        );
    }

    public function update(Request $request, ReportResponse $response): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:3', 'max:2000'],
        ]);

        $response->update($validated);

        return redirect()->back()->with('success', 'Tanggapan berhasil diperbarui.');
    }

    public function destroy(ReportResponse $response): RedirectResponse
    {
        $response->delete();

        return redirect()->back()->with('success', 'Tanggapan berhasil dihapus.');
    }
}