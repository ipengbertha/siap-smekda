<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Auto-logout user yang statusnya diubah admin (nonaktif/blokir)
     * ketika sesi login mereka masih berjalan.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->status !== 'active') {
            $message = $user->status === 'blocked'
                ? 'Akun kamu telah diblokir oleh admin.'
                : 'Akun kamu telah dinonaktifkan oleh admin.';

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('status', $message);
        }

        return $next($request);
    }
}
