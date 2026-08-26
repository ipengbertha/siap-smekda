import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertTriangle,
    Lightbulb,
    Search,
    ShieldCheck,
    Lock,
    MessageCircle,
    ChevronDown,
} from 'lucide-react';

const steps = [
    { number: '01', title: 'Sampaikan', desc: 'Kirim aduan atau aspirasi lewat form singkat.' },
    { number: '02', title: 'Diverifikasi', desc: 'Admin memeriksa dan menentukan tujuan laporan.' },
    { number: '03', title: 'Diproses', desc: 'Laporan ditindaklanjuti oleh pihak terkait.' },
    { number: '04', title: 'Selesai', desc: 'Kamu bisa memantau hingga masalah tuntas.' },
];

const features = [
    {
        icon: Lock,
        title: 'Privasi Terjaga',
        desc: 'Laporan dapat dikirim secara anonim tanpa membuat akun.',
    },
    {
        icon: ShieldCheck,
        title: 'Terstruktur',
        desc: 'Setiap laporan punya kode unik dan status yang jelas.',
    },
    {
        icon: MessageCircle,
        title: 'Responsif',
        desc: 'Admin memberikan tanggapan langsung terhadap laporanmu.',
    },
];

const faqs = [
    {
        q: 'Apakah harus punya akun untuk mengirim laporan?',
        a: 'Tidak. Kamu bisa mengirim aduan atau aspirasi secara anonim tanpa membuat akun.',
    },
    {
        q: 'Apakah identitas saya bisa disembunyikan?',
        a: 'Ya. Saat mengirim laporan, kamu bisa memilih opsi "Kirim secara anonim".',
    },
    {
        q: 'Bagaimana cara mengetahui status laporan saya?',
        a: 'Gunakan kode laporan yang kamu terima setelah mengirim, lalu masukkan di halaman Lacak Aduan.',
    },
    {
        q: 'Apa bedanya aduan dan aspirasi?',
        a: 'Aduan untuk melaporkan masalah (misal fasilitas rusak), aspirasi untuk menyampaikan ide atau saran perbaikan sekolah.',
    },
];

export default function Landing({ canLogin, canRegister }) {
    const [trackCode, setTrackCode] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const handleTrack = (e) => {
        e.preventDefault();
        if (!trackCode.trim()) return;
        router.get(route('track.show', trackCode.trim().toUpperCase()));
    };

    return (
        <div className="min-h-screen bg-cream">
            <Head title="SIAP SMEKDA - Sistem Informasi Aspirasi & Pengaduan" />

            {/* Navbar */}
            <nav className="bg-navy sticky top-0 z-10">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">SIAP SMEKDA</span>
                    <div className="hidden sm:flex items-center gap-6 text-sm text-marble-light">
                        <a href="#cara-kerja" className="hover:text-white transition">Cara Kerja</a>
                        <Link href={route('track.index')} className="hover:text-white transition">
                            Lacak Aduan
                        </Link>
                        <a href="#faq" className="hover:text-white transition">FAQ</a>
                    </div>
                    <div className="flex items-center gap-3">
                        {canLogin && (
                            <Link
                                href={route('login')}
                                className="text-sm text-white hover:text-marble-light transition"
                            >
                                Masuk
                            </Link>
                        )}
                        <Link
                            href={canLogin ? route('login') : route('register')}
                            className="bg-crimson text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-crimson-dark transition"
                        >
                            Buat Aduan
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-navy leading-tight">
                    Suaramu, Perubahanmu.
                </h1>
                <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
                    Sampaikan aduan dan aspirasi untuk menciptakan lingkungan
                    SMKN 2 Surabaya yang lebih baik.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={canLogin ? route('login') : route('register')}
                        className="bg-crimson text-white font-medium px-6 py-3 rounded-lg hover:bg-crimson-dark transition"
                    >
                        Buat Aduan
                    </Link>
                    <Link
                        href={route('track.index')}
                        className="bg-marble text-navy font-medium px-6 py-3 rounded-lg hover:bg-marble-dark transition"
                    >
                        Lacak Aduan
                    </Link>
                </div>
            </section>

            {/* Quick action cards */}
            <section className="mx-auto max-w-4xl px-6 -mt-2 mb-20">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    <div className="p-6 text-center">
                        <AlertTriangle className="mx-auto text-crimson" size={28} />
                        <p className="mt-3 font-medium text-navy">Buat Aduan</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Laporkan masalah di lingkungan sekolah.
                        </p>
                    </div>
                    <div className="p-6 text-center">
                        <Lightbulb className="mx-auto text-marble-dark" size={28} />
                        <p className="mt-3 font-medium text-navy">Sampaikan Aspirasi</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Berikan ide atau saran untuk sekolah.
                        </p>
                    </div>
                    <div className="p-6 text-center">
                        <Search className="mx-auto text-marble-dark" size={28} />
                        <p className="mt-3 font-medium text-navy">Pantau Laporan</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Cek perkembangan laporan yang dikirim.
                        </p>
                    </div>
                </div>
            </section>

            {/* Cara Kerja */}
            <section id="cara-kerja" className="mx-auto max-w-5xl px-6 mb-20">
                <h2 className="text-2xl font-bold text-navy text-center mb-2">
                    Cara Kerja
                </h2>
                <p className="text-gray-500 text-center mb-10">
                    Empat langkah sederhana dari kirim hingga selesai.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="bg-white rounded-xl border border-gray-100 p-5"
                        >
                            <span className="text-marble-dark font-bold text-sm">
                                {step.number}
                            </span>
                            <p className="font-medium text-navy mt-2">{step.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lacak Aduan */}
            <section className="mx-auto max-w-2xl px-6 mb-20">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <h2 className="text-xl font-semibold text-navy mb-1">
                        Sudah mengirim laporan?
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">
                        Masukkan kode laporan untuk melihat perkembangannya.
                    </p>
                    <form onSubmit={handleTrack} className="flex gap-2">
                        <input
                            type="text"
                            value={trackCode}
                            onChange={(e) => setTrackCode(e.target.value)}
                            placeholder="ADU-2026-00123"
                            className="flex-1 rounded-lg border-gray-300 uppercase focus:border-crimson focus:ring-crimson"
                        />
                        <button
                            type="submit"
                            className="bg-crimson text-white font-medium px-5 rounded-lg hover:bg-crimson-dark transition"
                        >
                            Lacak
                        </button>
                    </form>
                </div>
            </section>

            {/* Keunggulan */}
            <section className="mx-auto max-w-5xl px-6 mb-20">
                <h2 className="text-2xl font-bold text-navy text-center mb-10">
                    Aman. Mudah. Transparan.
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                    {features.map((f) => (
                        <div key={f.title} className="text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-marble/20 flex items-center justify-center">
                                <f.icon className="text-navy" size={22} />
                            </div>
                            <p className="font-medium text-navy mt-3">{f.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-2xl px-6 mb-20">
                <h2 className="text-2xl font-bold text-navy text-center mb-8">
                    Pertanyaan Umum
                </h2>
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg border border-gray-100 overflow-hidden"
                        >
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === index ? null : index)
                                }
                                className="w-full flex items-center justify-between px-5 py-4 text-left"
                            >
                                <span className="font-medium text-navy text-sm">
                                    {faq.q}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                                        openFaq === index ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {openFaq === index && (
                                <p className="px-5 pb-4 text-sm text-gray-500">
                                    {faq.a}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-navy py-16 px-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                    Punya sesuatu yang ingin disampaikan?
                </h2>
                <p className="text-marble-light mb-6">
                    Jangan biarkan aspirasimu berhenti sebagai keluhan.
                </p>
                <Link
                    href={canLogin ? route('login') : route('register')}
                    className="inline-block bg-crimson text-white font-medium px-6 py-3 rounded-lg hover:bg-crimson-dark transition"
                >
                    Sampaikan Aduan
                </Link>
            </section>

            {/* Footer */}
            <footer className="bg-navy border-t border-navy-light py-8 px-6">
                <div className="mx-auto max-w-6xl text-center text-sm text-marble-light">
                    © 2026 SIAP SMEKDA — SMKN 2 Surabaya
                </div>
            </footer>
        </div>
    );
}