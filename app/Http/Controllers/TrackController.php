<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Inertia\Inertia;
use Inertia\Response;

class TrackController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Track/Index');
    }

    public function show(string $code): Response
    {
        $report = Report::with([
                'category:id,name',
                'destination:id,name',
                'statusHistories',
                'responses' => fn ($q) => $q->where('is_internal', false),
                'rating',
            ])
            ->where('code', $code)
            ->where('status', '!=', 'diblokir')
            ->firstOrFail();

        return Inertia::render('Track/Show', [
            'report' => [
                'code'        => $report->code,
                'type'        => $report->type,
                'title'       => $report->title,
                'description' => $report->description,
                'status'      => $report->status,
                'priority'    => $report->priority,
                'is_anonymous'=> $report->is_anonymous,
                'reporter_name' => $report->is_anonymous ? null : $report->reporter_name,
                'category'    => $report->category?->name,
                'destination' => $report->destination?->name,
                'created_at'  => $report->created_at->format('d M Y, H:i'),
                'histories'   => $report->statusHistories->map(fn ($h) => [
                    'status'     => $h->status,
                    'note'       => $h->note ?? null,
                    'created_at' => $h->created_at->format('d M Y, H:i'),
                ]),
                'responses'   => $report->responses->map(fn ($r) => [
                    'message'    => $r->message ?? $r->response ?? '',
                    'created_at' => $r->created_at->format('d M Y, H:i'),
                ]),
                'rating'      => $report->rating ? [
                    'score'   => $report->rating->score,
                    'comment' => $report->rating->comment,
                    'is_resolved' => $report->rating->is_resolved,
                ] : null,
            ],
        ]);
    }
}