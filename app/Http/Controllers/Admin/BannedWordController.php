<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BannedWord;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BannedWordController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/BannedWords/Index', [
            'bannedWords' => BannedWord::orderBy('word')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'word' => ['required', 'string', 'max:255', 'unique:banned_words,word'],
        ]);

        $validated['is_active'] = true;

        BannedWord::create($validated);

        return redirect()->back()->with('success', 'Kata terlarang berhasil ditambahkan.');
    }

    public function update(Request $request, BannedWord $bannedWord): RedirectResponse
    {
        $validated = $request->validate([
            'word' => ['required', 'string', 'max:255', 'unique:banned_words,word,' . $bannedWord->id],
            'is_active' => ['boolean'],
        ]);

        $bannedWord->update($validated);

        return redirect()->back()->with('success', 'Kata terlarang berhasil diperbarui.');
    }

    public function toggleActive(BannedWord $bannedWord): RedirectResponse
    {
        $bannedWord->update(['is_active' => ! $bannedWord->is_active]);

        return redirect()->back()->with('success', $bannedWord->is_active
            ? 'Kata terlarang diaktifkan kembali.'
            : 'Kata terlarang dinonaktifkan.');
    }

    public function destroy(BannedWord $bannedWord): RedirectResponse
    {
        $bannedWord->delete();

        return redirect()->back()->with('success', 'Kata terlarang berhasil dihapus.');
    }
}
