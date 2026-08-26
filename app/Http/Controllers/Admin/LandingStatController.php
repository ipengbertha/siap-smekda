<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingStat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingStatController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Landing/Stats/Index', [
            'stats' => LandingStat::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'value' => 'required|string|max:50',
        ]);

        // taruh item baru di urutan paling akhir
        $validated['order'] = (LandingStat::max('order') ?? 0) + 1;
        $validated['is_active'] = true;

        LandingStat::create($validated);

        return redirect()->back()->with('success', 'Statistik berhasil ditambahkan.');
    }

    public function update(Request $request, LandingStat $stat): RedirectResponse
    {
        $validated = $request->validate([
            'label'     => 'required|string|max:255',
            'value'     => 'required|string|max:50',
            'is_active' => 'boolean',
        ]);

        $stat->update($validated);

        return redirect()->back()->with('success', 'Statistik berhasil diperbarui.');
    }

    public function destroy(LandingStat $stat): RedirectResponse
    {
        $stat->delete();

        return redirect()->back()->with('success', 'Statistik berhasil dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:landing_stats,id',
        ]);

        foreach ($validated['ids'] as $index => $id) {
            LandingStat::where('id', $id)->update(['order' => $index + 1]);
        }

        return redirect()->back();
    }
}