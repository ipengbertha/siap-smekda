<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @php
            // Favicon diambil langsung dari DB (bukan lewat Inertia) karena file ini
            // di-render server-side sebelum React hydrate. Fallback ke favicon statis
            // kalau admin belum pernah upload.
            $faviconPath = \App\Models\SystemSetting::get('favicon');
        @endphp
        <link rel="icon" type="image/x-icon" href="{{ $faviconPath ? \Illuminate\Support\Facades\Storage::url($faviconPath) : '/favicon.ico' }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>