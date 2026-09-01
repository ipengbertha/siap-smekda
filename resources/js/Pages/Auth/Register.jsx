import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, AtSign, Mail, Calendar, Phone, GraduationCap, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        birth_date: '',
        phone: '',
        class: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputWrapClass = "flex items-center gap-2 bg-white/90 rounded-xl px-4 py-2.5";
    const inputClass = "flex-1 border-0 focus:ring-0 bg-transparent text-navy text-sm placeholder-navy/40 p-0";

    return (
        <div className="min-h-screen relative grid lg:grid-cols-2">
    <Head title="Buat Akun" />

    {/* Background global, membentang di belakang dua kolom */}
    <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-mauve-900"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-crimson/25 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-mauve-500/40 rounded-full blur-[120px] animate-float [animation-delay:2s]"></div>
        <div className="absolute top-[40%] left-[30%] w-[350px] h-[350px] bg-mauve-300/30 rounded-full blur-[120px] animate-float [animation-delay:4s]"></div>
    </div>

    {/* Kiri — panel branding */}
    <div className="relative hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:order-2 flex-col items-center justify-center px-12 overflow-hidden">

                <img src="/images/SIAP.png" alt="SIAP SMEKDA" className="h-40 w-auto mb-8" />

                <h2 className="font-sans font-extrabold text-3xl xl:text-4xl text-white text-center leading-tight uppercase">
                    Jadi Bagian dari Perubahan.
                </h2>
                <p className="mt-4 text-white/50 text-center max-w-sm leading-relaxed">
                    Buat akun untuk mulai menyampaikan laporan dan aspirasimu di sekolah.
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
                <div className="w-full max-w-lg">
                    <Link href="/" className="flex lg:hidden items-center justify-center mb-8">
                        <img src="/images/SIAP.png" alt="SIAP SMEKDA" className="h-16 w-auto" />
                    </Link>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-8 sm:p-10">
                        <div className="mb-8">
                            <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                                Buat Akun Baru
                            </h1>
                            <p className="text-white/50 text-sm">
                                Isi data di bawah untuk mendaftar.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Nama */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1.5">
                                    Nama Lengkap
                                </label>
                                <div className={inputWrapClass}>
                                    <User size={18} className="text-crimson flex-shrink-0" />
                                    <input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        autoComplete="name"
                                        autoFocus
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={inputClass}
                                        placeholder="Nama sesuai identitas"
                                        required
                                    />
                                </div>
                                <InputError message={errors.name} className="mt-2 text-crimson" />
                            </div>

                            {/* Tanggal Lahir + No. Telp — 2 kolom */}
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="birth_date" className="block text-sm font-medium text-white/70 mb-1.5">
                                        Tanggal Lahir
                                    </label>
                                    <div className={inputWrapClass}>
                                        <Calendar size={18} className="text-crimson flex-shrink-0" />
                                        <input
                                            id="birth_date"
                                            type="date"
                                            name="birth_date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.birth_date} className="mt-2 text-crimson" />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-1.5">
                                        No. Telepon
                                    </label>
                                    <div className={inputWrapClass}>
                                        <Phone size={18} className="text-crimson flex-shrink-0" />
                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={data.phone}
                                            autoComplete="tel"
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className={inputClass}
                                            placeholder="08xxxxxxxxxx"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.phone} className="mt-2 text-crimson" />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">
                                    Email
                                </label>
                                <div className={inputWrapClass}>
                                    <Mail size={18} className="text-crimson flex-shrink-0" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={inputClass}
                                        placeholder="nama@email.com"
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2 text-crimson" />
                            </div>

                            {/* Kelas (Optional) */}
                            <div>
                                <label htmlFor="class" className="block text-sm font-medium text-white/70 mb-1.5">
                                    Kelas <span className="text-white/40 font-normal">(Opsional)</span>
                                </label>
                                <div className={inputWrapClass}>
                                    <GraduationCap size={18} className="text-crimson flex-shrink-0" />
                                    <input
                                        id="class"
                                        name="class"
                                        value={data.class}
                                        onChange={(e) => setData('class', e.target.value)}
                                        className={inputClass}
                                        placeholder="Contoh: XI RPL 2"
                                    />
                                </div>
                                <InputError message={errors.class} className="mt-2 text-crimson" />
                            </div>

                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-white/70 mb-1.5">
                                    Buat Username
                                </label>
                                <div className={inputWrapClass}>
                                    <AtSign size={18} className="text-crimson flex-shrink-0" />
                                    <input
                                        id="username"
                                        name="username"
                                        value={data.username}
                                        autoComplete="username"
                                        onChange={(e) => setData('username', e.target.value)}
                                        className={inputClass}
                                        placeholder="username unik"
                                        required
                                    />
                                </div>
                                <InputError message={errors.username} className="mt-2 text-crimson" />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1.5">
                                    Password
                                </label>
                                <div className={inputWrapClass}>
                                    <Lock size={18} className="text-crimson flex-shrink-0" />
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={inputClass}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-white/40 mt-1.5">
                                    Minimal 7 karakter, mengandung huruf dan karakter khusus (contoh: !@#$%).
                                </p>
                                <InputError message={errors.password} className="mt-2 text-crimson" />
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-white/70 mb-1.5">
                                    Konfirmasi Password
                                </label>
                                <div className={inputWrapClass}>
                                    <Lock size={18} className="text-crimson flex-shrink-0" />
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={inputClass}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2 text-crimson" />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-crimson text-white font-semibold px-6 py-3 rounded-full hover:bg-crimson-dark active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,1,143,0.35)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Daftar <ArrowRight size={18} />
                            </button>
                        </form>

                        <p className="text-center text-sm text-white/50 mt-8">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="text-gold font-semibold hover:text-white transition">
                                Masuk
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}