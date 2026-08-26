<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingStep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingStepController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Landing/Steps/Index', [
            'steps' => LandingStep::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string|max:500',
        ]);

        $validated['order'] = (LandingStep::max('order') ?? 0) + 1;

        LandingStep::create($validated);

        return redirect()->back()->with('success', 'Langkah berhasil ditambahkan.');
    }

    public function update(Request $request, LandingStep $step): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string|max:500',
        ]);

        $step->update($validated);

        return redirect()->back()->with('success', 'Langkah berhasil diperbarui.');
    }

    public function destroy(LandingStep $step): RedirectResponse
    {
        $step->delete();

        return redirect()->back()->with('success', 'Langkah berhasil dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:landing_steps,id',
        ]);

        foreach ($validated['ids'] as $index => $id) {
            LandingStep::where('id', $id)->update(['order' => $index + 1]);
        }

        return redirect()->back();
    }
}