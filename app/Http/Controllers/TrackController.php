<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Track/Index');
    }

    public function show(Request $request, string $code): Response
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

        $isOwner = $request->user()?->id === $report->user_id;
        $canEdit = filter_var(ReportSetting::get('report_allow_edit', true), FILTER_VALIDATE_BOOLEAN);
        $canDelete = filter_var(ReportSetting::get('report_allow_delete', true), FILTER_VALIDATE_BOOLEAN);
        $isEditable = $isOwner && $report->status === 'terkirim';

        return Inertia::render('Track/Show', [
            'report' => [
                'id'          => $report->id,
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
                'can_edit'    => $isEditable && $canEdit,
                'can_delete'  => $isEditable && $canDelete,
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