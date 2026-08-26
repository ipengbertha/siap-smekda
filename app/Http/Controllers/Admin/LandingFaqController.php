<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingFaq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingFaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Landing/Faqs/Index', [
            'faqs' => LandingFaq::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer'   => 'required|string|max:1000',
        ]);

        $validated['order'] = (LandingFaq::max('order') ?? 0) + 1;
        $validated['is_active'] = true;

        LandingFaq::create($validated);

        return redirect()->back()->with('success', 'FAQ berhasil ditambahkan.');
    }

    public function update(Request $request, LandingFaq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'question'  => 'required|string|max:255',
            'answer'    => 'required|string|max:1000',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);

        return redirect()->back()->with('success', 'FAQ berhasil diperbarui.');
    }

    public function destroy(LandingFaq $faq): RedirectResponse
    {
        $faq->delete();

        return redirect()->back()->with('success', 'FAQ berhasil dihapus.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:landing_faqs,id',
        ]);

        foreach ($validated['ids'] as $index => $id) {
            LandingFaq::where('id', $id)->update(['order' => $index + 1]);
        }

        return redirect()->back();
    }
}