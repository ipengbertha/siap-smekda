<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SorotanController extends Controller
{
    /**
     * Daftar laporan featured di halaman publik. Bisa diakses tamu maupun user login,
     * tapi like & komentar tetap butuh login (dicek di method masing-masing).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $reports = Report::featured()
            ->with(['category:id,name', 'user:id,name'])
            ->when($user, fn ($q) => $q->with(['likes' => fn ($l) => $l->where('user_id', $user->id)]))
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Report $report) => $this->transformSummary($report, $user));

        return Inertia::render('Sorotan/Index', [
            'reports' => $reports,
        ]);
    }

    public function show(Request $request, Report $report): Response
    {
        abort_unless($report->is_featured && $report->status !== 'diblokir', 404);

        $user = $request->user();

        $report->load([
            'category:id,name',
            'destination:id,name',
            'user:id,name',
            'comments.user:id,name,username',
            'responses' => fn ($q) => $q->where('is_internal', false),
        ])->loadCount(['likes', 'comments']);

        return Inertia::render('Sorotan/Show', [
            'report' => array_merge($this->transformSummary($report, $user), [
                'description' => $report->description,
                'destination' => $report->destination?->name,
                'created_at' => $report->created_at->format('d M Y, H:i'),
                'responses' => $report->responses->map(fn ($r) => [
                    'message' => $r->message,
                    'created_at' => $r->created_at->format('d M Y, H:i'),
                ]),
                'comments' => $report->comments->map(fn ($c) => [
                    'id' => $c->id,
                    'message' => $c->message,
                    'user_name' => $c->user?->name ?? 'Pengguna',
                    'created_at' => $c->created_at->diffForHumans(),
                ]),
            ]),
        ]);
    }

    /**
     * Toggle like (login required, ditegakkan lewat middleware 'auth' di route).
     */
    public function like(Request $request, Report $report): RedirectResponse
    {
        abort_unless($report->is_featured && $report->status !== 'diblokir', 404);

        $user = $request->user();
        $existing = $report->likes()->where('user_id', $user->id)->first();

        if ($existing) {
            $existing->delete();
        } else {
            $report->likes()->create(['user_id' => $user->id]);
            NotificationService::reportLiked($report, $user);
        }

        return redirect()->back(303);
    }

    public function storeComment(Request $request, Report $report): RedirectResponse
    {
        abort_unless($report->is_featured && $report->status !== 'diblokir', 404);

        $validated = $request->validate([
            'message' => ['required', 'string', 'min:2', 'max:1000'],
        ]);

        $report->comments()->create([
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
        ]);

        NotificationService::reportCommented($report, $request->user());

        return redirect()->back()->with('success', 'Komentar berhasil dikirim.');
    }

    /**
     * Bentuk ringkas laporan featured untuk kartu di index/publik dan header di show.
     * Nggak pernah bocorin identitas pelapor kalau is_anonymous true.
     */
    private function transformSummary(Report $report, $user): array
    {
        return [
            'id' => $report->id,
            'code' => $report->code,
            'title' => $report->title,
            'status' => $report->status,
            'category' => $report->category?->name,
            'reporter_name' => $report->is_anonymous ? 'Anonim' : ($report->user?->name ?? $report->reporter_name ?? 'Anonim'),
            'likes_count' => $report->likes_count,
            'comments_count' => $report->comments_count,
            'is_liked' => $report->isLikedBy($user),
            'created_at' => $report->created_at->format('d M Y'),
        ];
    }
}
