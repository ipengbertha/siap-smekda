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
    Plus,
    ArrowRight,
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

// Data contoh — nanti diganti data asli dari controller (lihat catatan di bawah)
const publicComplaints = [
    { category: 'Fasilitas', status: 'Diproses', title: 'Lampu kelas XI RPL mati sejak minggu lalu', likes: 18, comments: 5 },
    { category: 'Kantin', status: 'Selesai', title: 'Antrean kantin saat istirahat terlalu panjang', likes: 42, comments: 11 },
    { category: 'Sarana', status: 'Diproses', title: 'Lapangan basket rusak di beberapa titik', likes: 27, comments: 8 },
];

// Reusable "kicker" badge dipakai di atas tiap heading section
function SectionKicker({ label }) {
    return (
        <div className="inline-flex items-center gap-2 bg-navy-light border border-purple/30 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-crimson"></span>
            {label}
        </div>
    );
}

// Reusable glass card wrapper
function GlassCard({ children, className = '' }) {
    return (
        <div
            className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
                        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                        hover:bg-white/[0.14] hover:border-white/30
                        transition-all duration-300 ${className}`}
        >
            {children}
        </div>
    );
}

export default function Landing({ canLogin, canRegister, hero, footer, stats, steps, faqs }) {
    const [trackCode, setTrackCode] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const handleTrack = (e) => {
        e.preventDefault();
        if (!trackCode.trim()) return;
        router.get(route('track.show', trackCode.trim().toUpperCase()));
    };

    return (
        <div className="min-h-screen relative">
            <Head title="SIAP SMEKDA - Sistem Informasi Aspirasi & Pengaduan" />

            {/* Global background gradient + glow blobs, fixed behind everything */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-mauve-900"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-crimson/25 rounded-full blur-[120px]"></div>
                <div className="absolute top-[30%] left-[-15%] w-[450px] h-[450px] bg-mauve-500/40 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-mauve-300/30 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] left-[20%] w-[350px] h-[350px] bg-mauve-700/40 rounded-full blur-[120px]"></div>
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-20 bg-gold">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <img src="/images/logo.png" alt="SIAP SMEKDA" className="h-8 w-auto" />
                        <span className="font-sans font-bold text-navy text-lg">SIAP SMEKDA</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-5 text-sm font-semibold text-navy flex-shrink-0">
                        <a href="#statistik" className="hover:text-crimson transition">Statistik</a>
                        <a href="#cara-kerja" className="hover:text-crimson transition">Cara Kerja</a>
                        <a href="#aduan-publik" className="hover:text-crimson transition">Aduan Publik</a>
                        <a href="#keunggulan" className="hover:text-crimson transition">Keunggulan</a>
                        <a href="#faq" className="hover:text-crimson transition">FAQ</a>
                    </div>
                    <form onSubmit={handleTrack} className="hidden lg:flex items-center gap-2 bg-white/80 rounded-full px-3 py-1.5 w-52 flex-shrink-0">
                        <Search size={16} className="text-crimson flex-shrink-0" />
                        <input
                            type="text"
                            value={trackCode}
                            onChange={(e) => setTrackCode(e.target.value)}
                            placeholder="Lacak kode aduan..."
                            className="flex-1 border-0 focus:ring-0 bg-transparent text-navy text-sm placeholder-navy/50 uppercase p-0"
                        />
                    </form>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {canLogin && (
                            <Link href={route('login')} className="bg-crimson text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-crimson-dark transition">
                                Masuk
                            </Link>
                        )}
                        <Link href={canLogin ? route('login') : route('register')} className="bg-crimson text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-crimson-dark transition">
                            Buat Akun
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 text-center relative">
                <div className="inline-flex items-center justify-center bg-navy-light border border-purple/30 text-white text-sm font-bold px-6 py-2.5 rounded-full mb-6">
                    SMK NEGERI 1 SURABAYA
                </div>
                <h1 className="font-sans font-extrabold text-4xl sm:text-6xl text-purple leading-tight uppercase">
                    {hero.title}
                </h1>
                <p className="mt-5 text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
                    {hero.subtitle}
                </p>
            </section>

            {/* Statistik */}
            {stats.length > 0 && (
                <section id="statistik" className="mx-auto max-w-4xl px-6 mb-20 relative">
                    <div className="text-center mb-8">
                        <SectionKicker label="STATISTIK" />
                        <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
                            Dipercaya Warga Sekolah
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {stats.map((stat) => (
                            <GlassCard key={stat.label} className="p-5">
                                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs sm:text-sm text-white/50 mt-1">{stat.label}</p>
                            </GlassCard>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick action cards */}
            <section className="mx-auto max-w-4xl px-6 mb-24 relative">
                <GlassCard className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                    <div className="p-7 text-center">
                        <AlertTriangle className="mx-auto text-crimson" size={26} />
                        <p className="mt-3 font-medium text-white">Buat Aduan</p>
                        <p className="text-sm text-white/50 mt-1">
                            Laporkan masalah di lingkungan sekolah.
                        </p>
                    </div>
                    <div className="p-7 text-center">
                        <Lightbulb className="mx-auto text-mauve-100" size={26} />
                        <p className="mt-3 font-medium text-white">Sampaikan Aspirasi</p>
                        <p className="text-sm text-white/50 mt-1">
                            Berikan ide atau saran untuk sekolah.
                        </p>
                    </div>
                    <div className="p-7 text-center">
                        <Search className="mx-auto text-mauve-300" size={26} />
                        <p className="mt-3 font-medium text-white">Pantau Laporan</p>
                        <p className="text-sm text-white/50 mt-1">
                            Cek perkembangan laporan yang dikirim.
                        </p>
                    </div>
                </GlassCard>
            </section>

            {/* Cara Kerja — timeline style, tetap glass */}
            <section id="cara-kerja" className="mx-auto max-w-5xl px-6 mb-24 relative">
                <div className="text-center mb-12">
                    <SectionKicker label="CARA KERJA" />
                    <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                        Empat Langkah, Dari Suara Jadi Solusi
                    </h2>
                    <p className="text-white/50 max-w-md mx-auto">
                        Prosesnya berurutan dan transparan, mulai dari kamu mengirim sampai masalahnya benar-benar ditindaklanjuti.
                    </p>
                </div>
                <div className="relative">
                    <div className="hidden sm:block absolute top-5 left-0 right-0 h-px bg-white/15"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {steps.map((step) => (
                            <div key={step.number} className="relative">
                                <div className="w-10 h-10 rounded-full bg-crimson text-white font-bold text-sm flex items-center justify-center mb-4 relative z-10">
                                    {step.number}
                                </div>
                                <GlassCard className="p-5">
                                    <p className="font-semibold text-white">{step.title}</p>
                                    <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{step.desc}</p>
                                </GlassCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Aduan Publik — data contoh, ganti ke data asli nanti */}
            <section id="aduan-publik" className="mx-auto max-w-5xl px-6 mb-24 relative">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
                    <div>
                        <SectionKicker label="ADUAN PUBLIK" />
                        <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                            Yang Sedang Ditangani
                        </h2>
                        <p className="text-white/50 max-w-md">
                            Aduan yang diizinkan admin untuk dipublikasikan ke semua orang.
                        </p>
                    </div>
                    <Link href={route('track.index')} className="text-sm font-semibold text-gold hover:text-white transition whitespace-nowrap">
                        Lihat Semua Aduan →
                    </Link>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                    {publicComplaints.map((item, i) => (
                        <GlassCard key={i} className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="bg-purple/20 text-purple text-xs font-semibold px-3 py-1 rounded-full">
                                    {item.category}
                                </span>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                    item.status === 'Selesai' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gold/20 text-gold'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="font-medium text-white leading-snug mb-4">{item.title}</p>
                            <div className="flex items-center gap-4 text-sm text-white/50">
                                <span>👍 {item.likes}</span>
                                <span>💬 {item.comments}</span>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* Lacak Aduan */}
            <section className="mx-auto max-w-2xl px-6 mb-24 relative">
                <GlassCard className="p-10 text-center">
                    <SectionKicker label="LACAK ADUAN" />
                    <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                        Sudah Mengirim Aduan?
                    </h2>
                    <p className="text-sm text-white/50 mb-8 max-w-md mx-auto">
                        Masukkan kode aduanmu untuk melihat perkembangannya — meski dikirim secara anonim tanpa login.
                    </p>
                    <form onSubmit={handleTrack} className="flex items-center gap-2 bg-white/90 rounded-full pl-5 pr-2 py-2 max-w-lg mx-auto">
                        <Search size={18} className="text-crimson flex-shrink-0" />
                        <input
                            type="text"
                            value={trackCode}
                            onChange={(e) => setTrackCode(e.target.value)}
                            placeholder="Masukkan kode aduan, mis. ADU-2026-00123"
                            className="flex-1 border-0 focus:ring-0 bg-transparent text-navy placeholder-navy/40 uppercase p-0 text-sm"
                        />
                        <button type="submit" className="bg-crimson text-white rounded-full p-2.5 hover:bg-crimson-dark transition flex-shrink-0">
                            <ArrowRight size={16} />
                        </button>
                    </form>
                    <p className="text-xs text-white/40 mt-4 flex items-center justify-center gap-1.5">
                        <Lock size={12} /> Kode aduan diberikan otomatis setelah pengiriman berhasil.
                    </p>
                </GlassCard>
            </section>

            {/* Keunggulan */}
            <section id="keunggulan" className="mx-auto max-w-5xl px-6 mb-24 relative">
                <div className="text-center mb-12">
                    <SectionKicker label="KEUNGGULAN" />
                    <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
                        Aman. Mudah. Transparan.
                    </h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                    {features.map((f) => (
                        <GlassCard key={f.title} className="p-7 text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                <f.icon className="text-white" size={22} />
                            </div>
                            <p className="font-medium text-white mt-4">{f.title}</p>
                            <p className="text-sm text-white/50 mt-1">{f.desc}</p>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            {faqs.length > 0 && (
                <section id="faq" className="mx-auto max-w-2xl px-6 mb-24 relative">
                    <div className="text-center mb-10">
                        <SectionKicker label="FAQ" />
                        <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                            Pertanyaan Umum
                        </h2>
                        <p className="text-white/50">
                            Masih ragu? Ini beberapa hal yang paling sering ditanyakan.
                        </p>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <GlassCard
                                key={index}
                                className={`overflow-hidden ${openFaq === index ? '!border-crimson/40' : ''}`}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                                >
                                    <span className="font-medium text-white text-sm">
                                        {faq.q}
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-white/40 transition-transform flex-shrink-0 ml-2 ${
                                            openFaq === index ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {openFaq === index && (
                                    <p className="px-5 pb-4 text-sm text-white/50 leading-relaxed">
                                        {faq.a}
                                    </p>
                                )}
                            </GlassCard>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <p className="text-white/50 text-sm mb-3">Masih ada pertanyaan lain?</p>
                        <a href={`mailto:${footer.email}`} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/20 transition">
                            <Mail size={16} /> Hubungi Admin
                        </a>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="px-6 py-24 text-center relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-crimson/20 rounded-full blur-[100px]"></div>
            </div>
            <GlassCard className="mx-auto max-w-2xl p-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-crimson/20 border border-crimson/30 flex items-center justify-center mb-6">
                    <MessageCircle className="text-crimson" size={28} />
                </div>
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                    Punya Sesuatu yang Ingin Disampaikan?
                </h2>
                <p className="text-white/50 mb-8 max-w-md mx-auto">
                    Jangan biarkan aspirasimu berhenti sebagai keluhan. Suaramu penting untuk sekolah yang lebih baik.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={canLogin ? route('login') : route('register')}
                        className="bg-crimson text-white font-semibold px-6 py-3 rounded-full hover:bg-crimson-dark transition shadow-[0_4px_20px_rgba(255,1,143,0.35)]"
                    >
                        Sampaikan Aduan
                    </Link>
                    <Link
                        href={route('track.index')}
                        className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition"
                    >
                        Lacak Aduan Saya
                    </Link>
                </div>
            </GlassCard>
        </section>

            {/* Footer */}
            <footer className="border-t border-white/10 pt-16 pb-8 px-6 relative">
            <div className="mx-auto max-w-5xl">
                <div className="grid sm:grid-cols-3 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <img src="/images/logo.png" alt="SIAP SMEKDA" className="h-8 w-auto" />
                            <span className="font-sans font-bold text-white text-lg">SIAP SMEKDA</span>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed">
                            Sistem Informasi Aspirasi & Pengaduan — menjembatani suara warga sekolah menuju perubahan nyata.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <p className="font-semibold text-white text-sm mb-4">Tautan Cepat</p>
                        <div className="flex flex-col gap-2 text-sm text-white/50">
                            <a href="#statistik" className="hover:text-white transition w-fit">Statistik</a>
                            <a href="#cara-kerja" className="hover:text-white transition w-fit">Cara Kerja</a>
                            <a href="#aduan-publik" className="hover:text-white transition w-fit">Aduan Publik</a>
                            <a href="#faq" className="hover:text-white transition w-fit">FAQ</a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="font-semibold text-white text-sm mb-4">Kontak</p>
                        <div className="flex flex-col gap-3 text-sm text-white/50">
                            {footer.email && (
                                <p className="flex items-center gap-2">
                                    <Mail size={15} className="flex-shrink-0" /> {footer.email}
                                </p>
                            )}
                            {footer.phone && (
                                <p className="flex items-center gap-2">
                                    <Phone size={15} className="flex-shrink-0" /> {footer.phone}
                                </p>
                            )}
                            {footer.address && (
                                <p className="flex items-start gap-2">
                                    <MapPin size={15} className="flex-shrink-0 mt-0.5" /> {footer.address}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {(footer.instagram || footer.facebook || footer.youtube || footer.whatsapp) && (
                    <div className="flex justify-center gap-3 mb-8">
                        {footer.instagram && (
                            <a href={footer.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-crimson hover:border-crimson transition">
                                <Link2 size={16} className="text-white" />
                            </a>
                        )}
                        {footer.facebook && (
                            <a href={footer.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-crimson hover:border-crimson transition">
                                <Link2 size={16} className="text-white" />
                            </a>
                        )}
                        {footer.youtube && (
                            <a href={footer.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-crimson hover:border-crimson transition">
                                <Link2 size={16} className="text-white" />
                            </a>
                        )}
                        {footer.whatsapp && (
                            <a href={`https://wa.me/${footer.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-crimson hover:border-crimson transition">
                                <Phone size={16} className="text-white" />
                            </a>
                        )}
                    </div>
                )}

                <div className="text-center text-sm text-white/40 border-t border-white/10 pt-6">
                    {footer.copyright}
                </div>
            </div>
        </footer>

            {/* Floating Buat Aduan */}
            <Link
                href={canLogin ? route('login') : route('register')}
                className="fixed bottom-6 right-6 z-30 bg-crimson text-gold font-sans font-bold px-6 py-4 rounded-full shadow-[0_8px_24px_rgba(255,1,143,0.5)] flex items-center gap-2 hover:bg-crimson-dark hover:scale-105 transition-all"
            >
                <Plus size={20} /> Buat Aduan
            </Link>
        </div>
    );
}