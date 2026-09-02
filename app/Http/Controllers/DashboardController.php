<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return $this->adminDashboard();
        }

        return $this->userDashboard($user);
    }

    private function userDashboard(User $user): Response
    {
        $reports = $user->reports();

        $stats = [
            'total' => (clone $reports)->count(),
            'diproses' => (clone $reports)->whereIn('status', ['terkirim', 'diterima', 'diproses', 'ditanggapi'])->count(),
            'selesai' => (clone $reports)->where('status', 'selesai')->count(),
            'ditolak' => (clone $reports)->where('status', 'ditolak')->count(),
            'diblokir' => (clone $reports)->where('status', 'diblokir')->count(),
        ];

        $recentReports = (clone $reports)
            ->with(['category:id,name', 'destination:id,name'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (Report $report) => [
                'id' => $report->id,
                'code' => $report->code,
                'title' => $report->title,
                'category' => $report->category?->name,
                'destination' => $report->destination?->name,
                'status' => $report->status,
                'created_at' => $report->created_at->translatedFormat('d M Y, H:i'),
            ]);

        $categoryBreakdown = Category::query()
            ->withCount(['reports' => fn ($q) => $q->where('user_id', $user->id)])
            ->get(['id', 'name'])
            ->filter(fn (Category $category) => $category->reports_count > 0)
            ->sortByDesc('reports_count')
            ->take(5)
            ->values()
            ->map(fn (Category $category) => [
                'name' => $category->name,
                'count' => $category->reports_count,
            ]);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentReports' => $recentReports,
            'categoryBreakdown' => $categoryBreakdown,
        ]);
    }

    private function adminDashboard(): Response
    {
        $stats = [
            'total' => Report::count(),
            'baru' => Report::whereIn('status', ['terkirim', 'diterima'])->count(),
            'diproses' => Report::whereIn('status', ['diproses', 'ditanggapi'])->count(),
            'selesai' => Report::where('status', 'selesai')->count(),
            'ditolak' => Report::where('status', 'ditolak')->count(),
            'diblokir' => Report::where('status', 'diblokir')->count(),
            'total_users' => User::where('role', 'user')->count(),
        ];

        $recentReports = Report::with(['category:id,name', 'user:id,name'])
            ->latest()
            ->take(6)
            ->get()
            ->map(fn (Report $report) => [
                'id' => $report->id,
                'code' => $report->code,
                'title' => $report->title,
                'category' => $report->category?->name,
                'reporter' => $report->is_anonymous ? 'Anonim' : ($report->user?->name ?? $report->reporter_name ?? '-'),
                'status' => $report->status,
                'created_at' => $report->created_at->translatedFormat('d M Y, H:i'),
            ]);

        $categoryBreakdown = Category::withCount('reports')
            ->orderByDesc('reports_count')
            ->take(5)
            ->get(['id', 'name'])
            ->map(fn (Category $category) => [
                'name' => $category->name,
                'count' => $category->reports_count,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentReports' => $recentReports,
            'categoryBreakdown' => $categoryBreakdown,
        ]);
    }
}