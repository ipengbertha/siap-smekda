<?php

namespace App\Http\Controllers;

use App\Models\LandingFaq;
use App\Models\LandingSetting;
use App\Models\LandingStat;
use App\Models\LandingStep;
use App\Models\Report;
use Illuminate\Support\Facades\Route as RouteFacade;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(): Response
    {
        $settings = LandingSetting::pluck('value', 'key');

        return Inertia::render('Landing', [
            'canLogin' => RouteFacade::has('login'),
            'canRegister' => RouteFacade::has('register'),

            'hero' => [
                'title'    => $settings->get('hero_title', 'Suaramu, Perubahanmu.'),
                'subtitle' => $settings->get('hero_subtitle', ''),
            ],

            'footer' => [
                'copyright' => $settings->get('footer_copyright', '© 2026 SIAP SMEKDA'),
                'email'     => $settings->get('footer_email', ''),
                'phone'     => $settings->get('footer_phone', ''),
                'address'   => $settings->get('footer_address', ''),
                'instagram' => $settings->get('social_instagram', ''),
                'facebook'  => $settings->get('social_facebook', ''),
                'youtube'   => $settings->get('social_youtube', ''),
                'whatsapp'  => $settings->get('social_whatsapp', ''),
            ],

            'stats' => LandingStat::where('is_active', true)
                ->orderBy('order')
                ->get(['label', 'value']),

            'steps' => LandingStep::orderBy('order')
                ->get(['title', 'description'])
                ->map(fn ($step, $i) => [
                    'number' => str_pad($i + 1, 2, '0', STR_PAD_LEFT),
                    'title'  => $step->title,
                    'desc'   => $step->description,
                ]),

            'faqs' => LandingFaq::where('is_active', true)
                ->orderBy('order')
                ->get(['question', 'answer'])
                ->map(fn ($faq) => [
                    'q' => $faq->question,
                    'a' => $faq->answer,
                ]),

            'featuredReports' => Report::featured()
                ->with('category:id,name')
                ->withCount(['likes', 'comments'])
                ->latest()
                ->take(3)
                ->get()
                ->map(fn ($report) => [
                    'code' => $report->code,
                    'category' => $report->category?->name ?? 'Umum',
                    'status' => self::STATUS_DISPLAY[$report->status] ?? ucfirst($report->status),
                    'title' => $report->title,
                    'likes' => $report->likes_count,
                    'comments' => $report->comments_count,
                ]),
        ]);
    }

    protected const STATUS_DISPLAY = [
        'terkirim' => 'Terkirim',
        'diterima' => 'Diterima',
        'diproses' => 'Diproses',
        'ditanggapi' => 'Ditanggapi',
        'selesai' => 'Selesai',
        'ditolak' => 'Ditolak',
    ];
}