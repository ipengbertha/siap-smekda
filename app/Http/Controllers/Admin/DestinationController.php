<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Destinations/Index', [
            'destinations' => Destination::withCount('reports')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $validated['is_active'] = true;

        Destination::create($validated);

        return redirect()->back()->with('success', 'Tujuan berhasil ditambahkan.');
    }

    public function update(Request $request, Destination $destination): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
        ]);

        $destination->update($validated);

        return redirect()->back()->with('success', 'Tujuan berhasil diperbarui.');
    }

    public function toggleActive(Destination $destination): RedirectResponse
    {
        $destination->update(['is_active' => ! $destination->is_active]);

        return redirect()->back()->with('success', $destination->is_active
            ? 'Tujuan diaktifkan kembali.'
            : 'Tujuan dinonaktifkan.');
    }

    public function destroy(Destination $destination): RedirectResponse
    {
        if ($destination->reports()->exists()) {
            return redirect()->back()->with('error', 'Tujuan tidak bisa dihapus karena masih dipakai oleh aduan. Nonaktifkan saja tujuan ini.');
        }

        $destination->delete();

        return redirect()->back()->with('success', 'Tujuan berhasil dihapus.');
    }
}
