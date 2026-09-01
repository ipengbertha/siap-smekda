import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AtSign, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };
return (
        <div className="min-h-screen relative grid lg:grid-cols-2">
            <Head title="Masuk" />

            {/* Kiri — panel branding */}
            <div className="relative hidden lg:flex flex-col items-center justify-center px-12 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-mauve-900"></div>
                    <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-crimson/25 rounded-full blur-[120px] animate-float"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-mauve-500/40 rounded-full blur-[120px] animate-float [animation-delay:2s]"></div>
                    <div className="absolute top-[40%] left-[10%] w-[350px] h-[350px] bg-mauve-300/30 rounded-full blur-[120px] animate-float [animation-delay:4s]"></div>
                </div>

                <img src="/images/SIAP.png" alt="SIAP SMEKDA" className="h-40 w-auto mb-8" />

                <h2 className="font-sans font-extrabold text-3xl xl:text-4xl text-white text-center leading-tight uppercase">
                    Suaramu, Bagian dari Perubahan.
                </h2>
                <p className="mt-4 text-white/50 text-center max-w-sm leading-relaxed">
                    Masuk untuk menyampaikan laporan, memantau progres, dan jadi bagian dari perbaikan sekolah kita.
                </p>

                <Link
                    href="/"
                    className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition"
                >
                    <ArrowLeft size={16} /> Kembali ke Beranda
                </Link>
            </div>

            {/* Kanan — form */}
            <div className="relative flex items-center justify-center px-6 py-12 lg:order-1">
                {/* Background khusus mobile (karena panel kiri disembunyikan di layar kecil) */}
                <div className="absolute inset-0 -z-10 lg:hidden overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-mauve-900"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-crimson/25 rounded-full blur-[120px] animate-float"></div>
                </div>
                <div className="absolute inset-0 -z-10 hidden lg:block bg-mauve-900"></div>

                <div className="w-full max-w-md">
                    {/* Logo cuma muncul di mobile, karena panel kiri kepotong */}
                    <Link href="/" className="flex lg:hidden items-center justify-center mb-8">
                        <img src="/images/SIAP.png" alt="SIAP SMEKDA" className="h-16 w-auto" />
                    </Link>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-8 sm:p-10">
                        <div className="mb-8">
                            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                                Selamat Datang Kembali
                            </h1>
                            <p className="text-white/50 text-sm">
                                Masuk ke akunmu untuk melanjutkan.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-white/70 mb-1.5">
                                    Username
                                </label>
                                <div className="flex items-center gap-2 bg-white/90 rounded-xl px-4 py-2.5">
                                    <AtSign size={18} className="text-crimson flex-shrink-0" />
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        value={data.username}
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="flex-1 border-0 focus:ring-0 bg-transparent text-navy text-sm placeholder-navy/40 p-0"
                                        placeholder="username kamu"
                                    />
                                </div>
                                <InputError message={errors.username} className="mt-2 text-crimson" />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1.5">
                                    Password
                                </label>
                                <div className="flex items-center gap-2 bg-white/90 rounded-xl px-4 py-2.5">
                                    <Lock size={18} className="text-crimson flex-shrink-0" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="flex-1 border-0 focus:ring-0 bg-transparent text-navy text-sm placeholder-navy/40 p-0"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="text-navy/40 hover:text-crimson transition flex-shrink-0"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2 text-crimson" />
                            </div>

                            {/* Remember + Forgot password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-white/30 bg-white/10 text-crimson focus:ring-crimson/50"
                                    />
                                    Ingat saya
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-white/60 hover:text-white transition"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-crimson text-white font-semibold px-6 py-3 rounded-full hover:bg-crimson-dark active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,1,143,0.35)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Masuk <ArrowRight size={18} />
                            </button>
                        </form>

                        <p className="text-center text-sm text-white/50 mt-8">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="text-gold font-semibold hover:text-white transition">
                                Buat Akun
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}