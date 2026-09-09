<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReportSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ReportSettingController extends Controller
{
    public function index(): Response
    {
        $settings = ReportSetting::pluck('value', 'key');

        return Inertia::render('Admin/Reports/Settings', [
            'settings' => [
                'report_allow_anonymous' => filter_var($settings->get('report_allow_anonymous', true), FILTER_VALIDATE_BOOLEAN),
                'report_allow_edit'      => filter_var($settings->get('report_allow_edit', true), FILTER_VALIDATE_BOOLEAN),
                'report_allow_delete'    => filter_var($settings->get('report_allow_delete', true), FILTER_VALIDATE_BOOLEAN),

                'report_max_attachment_size_kb'     => (int) $settings->get('report_max_attachment_size_kb', 10240),
                'report_allowed_attachment_formats'  => $settings->get('report_allowed_attachment_formats', 'jpg,jpeg,png,mp4,mov'),
                'report_max_attachment_count'        => (int) $settings->get('report_max_attachment_count', 5),

                'report_disabled_statuses' => ReportSetting::disabledStatuses(),
            ],
            'availableStatuses' => ReportSetting::AVAILABLE_STATUSES,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'report_allow_anonymous' => ['boolean'],
            'report_allow_edit'      => ['boolean'],
            'report_allow_delete'    => ['boolean'],

            'report_max_attachment_size_kb'    => ['required', 'integer', 'min:1', 'max:102400'], // maks 100MB
            'report_allowed_attachment_formats' => ['required', 'string'],
            'report_max_attachment_count'        => ['required', 'integer', 'min:1', 'max:20'],

            'report_disabled_statuses'   => ['array'],
            'report_disabled_statuses.*' => [Rule::in(ReportSetting::AVAILABLE_STATUSES)],
        ]);

        // Normalisasi daftar format lampiran: buang spasi, huruf kecil, hilangkan duplikat/entri kosong
        $formats = collect(explode(',', $validated['report_allowed_attachment_formats']))
            ->map(fn ($f) => strtolower(trim($f)))
            ->filter()
            ->unique()
            ->values();

        ReportSetting::set('report_allow_anonymous', $validated['report_allow_anonymous'] ?? false);
        ReportSetting::set('report_allow_edit', $validated['report_allow_edit'] ?? false);
        ReportSetting::set('report_allow_delete', $validated['report_allow_delete'] ?? false);
        ReportSetting::set('report_max_attachment_size_kb', $validated['report_max_attachment_size_kb']);
        ReportSetting::set('report_allowed_attachment_formats', $formats->implode(','));
        ReportSetting::set('report_max_attachment_count', $validated['report_max_attachment_count']);
        ReportSetting::set('report_disabled_statuses', json_encode(array_values($validated['report_disabled_statuses'] ?? [])));

        return redirect()->back()->with('success', 'Pengaturan aduan berhasil disimpan.');
    }
}