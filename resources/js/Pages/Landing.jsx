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
    Link2,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react';

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

export default function Landing({ canLogin, canRegister, hero, footer, stats, steps, faqs }) {
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
                    {hero.title}
                </h1>
                <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
                    {hero.subtitle}
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

            {/* Statistik */}
            {stats.length > 0 && (
                <section className="mx-auto max-w-4xl px-6 mb-16">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-2xl sm:text-3xl font-bold text-navy">{stat.value}</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

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
            {faqs.length > 0 && (
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
            )}

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
            <footer className="bg-navy border-t border-navy-light py-10 px-6">
                <div className="mx-auto max-w-4xl">
                    <div className="grid sm:grid-cols-2 gap-6 text-sm text-marble-light mb-6">
                        <div className="space-y-2">
                            {footer.email && (
                                <p className="flex items-center gap-2">
                                    <Mail size={16} /> {footer.email}
                                </p>
                            )}
                            {footer.phone && (
                                <p className="flex items-center gap-2">
                                    <Phone size={16} /> {footer.phone}
                                </p>
                            )}
                        </div>
                        {footer.address && (
                            <div className="flex items-start gap-2">
                                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                <p>{footer.address}</p>
                            </div>
                        )}
                    </div>

                    {(footer.instagram || footer.facebook || footer.youtube || footer.whatsapp) && (
                        <div className="flex justify-center gap-4 mb-6 text-sm">
                            {footer.instagram && (
                                <a href={footer.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-marble-light hover:text-white transition">
                                    <Link2 size={16} /> Instagram
                                </a>
                            )}
                            {footer.facebook && (
                                <a href={footer.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-marble-light hover:text-white transition">
                                    <Link2 size={16} /> Facebook
                                </a>
                            )}
                            {footer.youtube && (
                                <a href={footer.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-marble-light hover:text-white transition">
                                    <Link2 size={16} /> YouTube
                                </a>
                            )}
                            {footer.whatsapp && (
                                <a href={`https://wa.me/${footer.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-marble-light hover:text-white transition">
                                    <Phone size={16} /> WhatsApp
                                </a>
                            )}
                        </div>
                    )}

                    <div className="text-center text-sm text-marble-light border-t border-navy-light pt-6">
                        {footer.copyright}
                    </div>
                </div>
            </footer>
        </div>
    );
}