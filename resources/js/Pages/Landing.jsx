import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';
import {
    AlertTriangle,
    Lightbulb,
    Search,
    ShieldCheck,
    Lock,
    MessageCircle,
    MessageSquare,
    ThumbsUp,
    ChevronDown,
    Link2,
    Mail,
    MapPin,
    Phone,
    Plus,
    ArrowRight,
} from 'lucide-react';

const features = [
    { icon: Lock, title: 'Tetap Privat', desc: 'Gunakan fitur anonim untuk menjaga identitasmu tetap tersembunyi dari publik.', color: 'from-crimson/40 to-crimson/10 text-crimson' },
    { icon: ShieldCheck, title: 'Nggak Takut Kehilangan Laporan', desc: 'Setiap laporan punya kode unik — pakai untuk menemukan dan memantau perkembangannya kapan saja.', color: 'from-purple/40 to-purple/10 text-purple' },
    { icon: MessageCircle, title: 'Lebih Cepat Ditindaklanjuti', desc: 'Laporan diteruskan ke pihak terkait dengan alur yang jelas.', color: 'from-gold/40 to-gold/10 text-gold' },
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

function CountUp({ value, duration = 1200 }) {
    const [ref, isInView] = useInView();
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        if (!isInView) return;
        const numMatch = value.match(/[\d.,]+/);
        if (!numMatch) return; // non-numeric (mis. "< 2 Hari") langsung tampil apa adanya
        const target = parseFloat(numMatch[0].replace(/\./g, '').replace(',', '.'));
        const prefix = value.slice(0, numMatch.index);
        const suffix = value.slice(numMatch.index + numMatch[0].length);
        let start = 0;
        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * target);
            setDisplay(`${prefix}${current.toLocaleString('id-ID')}${suffix}`);
            if (progress < 1) requestAnimationFrame(tick);
            else setDisplay(value);
        };
        requestAnimationFrame(tick);
    }, [isInView]);

    return <span ref={ref}>{display}</span>;
}

function Reveal({ children, className = '' }) {
    const [ref, isInView] = useInView();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${className}`}
        >
            {children}
        </div>
    );
}

export default function Landing({ canLogin, canRegister, hero, footer, stats, steps, faqs }) {
    const [navTrackCode, setNavTrackCode] = useState('');
    const [sectionTrackCode, setSectionTrackCode] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const handleTrack = (e, code) => {
        e.preventDefault();
        if (!code.trim()) return;
        router.get(route('track.show', code.trim().toUpperCase()));
    };
    return (
        <div className="min-h-screen relative">
            <Head title="SIAP SMEKDA - Sistem Informasi Aspirasi & Pengaduan" />

            {/* Global background gradient + glow blobs, fixed behind everything */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-mauve-900"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-crimson/25 rounded-full blur-[120px] animate-float"></div>
                <div className="absolute top-[30%] left-[-15%] w-[450px] h-[450px] bg-mauve-500/40 rounded-full blur-[120px] animate-float [animation-delay:2s]"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-mauve-300/30 rounded-full blur-[120px] animate-float [animation-delay:4s]"></div>
                <div className="absolute bottom-[20%] left-[20%] w-[350px] h-[350px] bg-mauve-700/40 rounded-full blur-[120px] animate-float [animation-delay:6s]"></div>
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-20 bg-gold">
                <div className="mx-auto max-w-6xl px-6 py-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <img src="/images/SIAP-SMEKDA.png" alt="SIAP SMEKDA" className="h-12 w-auto" />
                    </div>
                    <div className="hidden sm:flex items-center gap-5 text-sm font-semibold text-navy flex-shrink-0">
                        <a href="#statistik" className="hover:text-crimson transition">Statistik</a>
                        <a href="#cara-kerja" className="hover:text-crimson transition">Cara Kerja</a>
                        <a href="#aduan-publik" className="hover:text-crimson transition">Aduan Publik</a>
                        <a href="#keunggulan" className="hover:text-crimson transition">Keunggulan</a>
                        <a href="#faq" className="hover:text-crimson transition">FAQ</a>
                    </div>
                    <form onSubmit={(e) => handleTrack(e, navTrackCode)} className="hidden lg:flex items-center gap-2 bg-white/80 rounded-full px-3 py-1.5 w-52 flex-shrink-0">
                        <Search size={16} className="text-crimson flex-shrink-0" />
                        <input
                            type="text"
                            value={navTrackCode}
                            onChange={(e) => setNavTrackCode(e.target.value)}
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
                        {canRegister && (
                            <Link href={route('register')} className="bg-crimson text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-crimson-dark transition">
                                Buat Akun
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="mx-auto max-w-3xl px-6 pt-12 pb-16 text-center relative">
                <div className="inline-flex items-center justify-center bg-navy-light border border-purple/30 text-white text-sm font-bold px-6 py-2.5 rounded-full mb-6">
                    SMK NEGERI 2 SURABAYA
                </div>
                <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-purple leading-tight uppercase"> {hero.title}
                </h1>
                <p className="mt-5 text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
                    {hero.subtitle}
                </p>
            </section>

            {/* Statistik */}
            {stats.length > 0 && (
                <Reveal>
            <section id="statistik" className="mx-auto max-w-4xl px-6 mb-20 relative">
                <div className="text-center mb-8">
                    <SectionKicker label="TENTANG SIAP SMEKDA" />
                    <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
                        Suaramu, Bagian dari Perubahan.
                    </h2>
                    <p className="text-white/50 max-w-md mx-auto mt-2">
                        Setiap laporan yang masuk menunjukkan kepedulian warga sekolah.
                    </p>
                </div>
                <GlassCard className="p-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/10">
                    {stats.map((stat) => {
                        const isHighlight = stat.label.toLowerCase().includes('kepuasan');
                        return (
                            <div key={stat.label} className="p-6 text-center">
                                <p className={`font-bold ${isHighlight ? 'text-3xl sm:text-4xl text-crimson' : 'text-2xl sm:text-3xl text-white'}`}>
                                    <CountUp value={stat.value} />
                                </p>
                                <p className="text-xs sm:text-sm text-white/50 mt-1">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
                </GlassCard>
            </section>
            </Reveal>
        )}

            {/* Quick action cards */}
            <Reveal>
            <section className="mx-auto max-w-4xl px-6 mb-24 relative">
                <div className="text-center mb-8">
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
                    Ada yang Ingin Kamu Sampaikan?
                </h2>
            </div>
            <GlassCard className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                <div className="p-7 text-center">
                    <AlertTriangle className="mx-auto text-crimson" size={26} />
                    <p className="mt-3 font-medium text-white">Laporkan Masalah</p>
                    <p className="text-sm text-white/50 mt-1">
                        Ada fasilitas atau layanan sekolah yang perlu diperhatikan? Ceritakan kepada kami.
                    </p>
                </div>
                <div className="p-7 text-center">
                    <Lightbulb className="mx-auto text-mauve-100" size={26} />
                    <p className="mt-3 font-medium text-white">Bagikan Ide</p>
                    <p className="text-sm text-white/50 mt-1">
                        Punya gagasan yang bisa bikin sekolah lebih baik? Kami ingin dengar.
                    </p>
                </div>
                <div className="p-7 text-center">
                    <Search className="mx-auto text-mauve-300" size={26} />
                    <p className="mt-3 font-medium text-white">Pantau Laporan</p>
                    <p className="text-sm text-white/50 mt-1">
                        Sudah kirim laporan? Lihat perkembangannya pakai kode laporanmu.
                    </p>
                </div>
            </GlassCard>
            </section>
            </Reveal>

            {/* Cara Kerja — timeline style, tetap glass */}
            <Reveal>
            <section id="cara-kerja" className="mx-auto max-w-5xl px-6 mb-24 relative">
                <SectionKicker label="CARA KERJA" />
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                    Dari Laporan, Menjadi Tindakan.
                </h2>
                <p className="text-white/50 max-w-md mb-5">
                    Menyampaikan laporan nggak harus rumit. Ikuti empat langkah sederhana dan pantau prosesnya sampai selesai.
                </p>
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
            </Reveal>

            {/* Aduan Publik — data contoh, ganti ke data asli nanti */}
            <Reveal>
            <section id="aduan-publik" className="mx-auto max-w-5xl px-6 mb-24 relative">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
                    <div>
                        <SectionKicker label="TRANSPARANSI" />
                        <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                            Lihat Apa yang Sedang Ditangani.
                        </h2>
                        <p className="text-white/50 max-w-md">
                            Beberapa laporan yang sudah diverifikasi bisa dilihat di sini — biar kita sama-sama tahu apa yang lagi diperbaiki.
                        </p>
                    </div>
                    <Link href={route('track.index')} className="text-sm font-semibold text-gold hover:text-white transition whitespace-nowrap">
                        Lihat Semua Aduan →
                    </Link>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                    {publicComplaints.map((item, i) => {
                        const progress = item.status === 'Selesai' ? 100 : item.status === 'Diproses' ? 60 : 25;
                        return (
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
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                                    <div
                                        className={`h-full rounded-full ${item.status === 'Selesai' ? 'bg-emerald-400' : 'bg-gold'}`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-white/50">
                                    <span className="flex items-center gap-1.5">
                                        <ThumbsUp size={14} className="text-crimson/70" /> {item.likes}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare size={14} className="text-purple/70" /> {item.comments}
                                    </span>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            </section>
            </Reveal>

            {/* Lacak Aduan */}
            <Reveal>
            <section className="mx-auto max-w-4xl px-6 mb-24 relative">
                <GlassCard className="p-8 sm:p-10 grid sm:grid-cols-5 gap-8 items-center">
                    <div className="sm:col-span-3 text-center sm:text-left">
                        <SectionKicker label="LACAK LAPORAN" />
                        <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                            Sudah Mengirim Laporan?
                        </h2>
                        <p className="text-sm text-white/50 mb-6 max-w-md">
                            Masukkan kode laporanmu buat cek sampai mana prosesnya — nggak perlu nebak-nebak.
                        </p>
                        <form onSubmit={(e) => handleTrack(e, sectionTrackCode)} className="flex items-center gap-2 bg-white/90 rounded-full pl-5 pr-2 py-2">
                        <Search size={18} className="text-crimson flex-shrink-0" />
                        <input
                            type="text"
                            value={sectionTrackCode}
                            onChange={(e) => setSectionTrackCode(e.target.value)}
                            placeholder="Masukkan kode laporan..."
                            className="flex-1 border-0 focus:ring-0 bg-transparent text-navy placeholder-navy/40 uppercase placeholder:normal-case p-0 text-sm min-w-0"
                        />
                        <button
                            type="submit"
                            className="bg-crimson text-white rounded-full px-4 py-2.5 hover:bg-crimson-dark transition flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap"
                        >
                            Lacak <ArrowRight size={16} />
                        </button>
                    </form>
                        <p className="text-xs text-white/40 mt-4 flex items-center gap-1.5 justify-center sm:justify-start">
                            <Lock size={12} /> Belum punya kode? Kode diberikan otomatis setelah laporan berhasil dikirim.
                        </p>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                        {['Sampaikan', 'Verifikasi', 'Diproses', 'Selesai'].map((label, i) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                    i <= 1 ? 'bg-crimson text-white' : 'bg-white/10 text-white/40'
                                }`}>
                                    {i + 1}
                                </div>
                                <div className={`flex-1 h-px ${i <= 1 ? 'bg-crimson/50' : 'bg-white/10'}`} />
                                <span className={`text-xs ${i <= 1 ? 'text-white' : 'text-white/40'}`}>{label}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </section>
            </Reveal>

            {/* Keunggulan */}
            <Reveal>
            <section id="keunggulan" className="mx-auto max-w-5xl px-6 mb-24 relative">
                <div className="text-center mb-12">
                    <SectionKicker label="KENAPA SIAP SMEKDA?" />
                    <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                        Menyampaikan Suara Seharusnya Tidak Sulit.
                    </h2>
                    <p className="text-white/50 max-w-md mx-auto">
                        SIAP SMEKDA hadir agar setiap warga sekolah bisa menyampaikan laporan dan aspirasi dengan lebih mudah, aman, dan transparan.
                    </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <GlassCard key={f.title} className="p-7 text-center relative overflow-hidden">
                            <span className="absolute top-4 right-4 text-4xl font-extrabold text-white/5">
                                0{i + 1}
                            </span>
                            <div className={`mx-auto w-14 h-14 rounded-full bg-gradient-to-br ${f.color} border border-white/10 flex items-center justify-center`}>
                                <f.icon size={24} />
                            </div>
                            <p className="font-medium text-white mt-4">{f.title}</p>
                            <p className="text-sm text-white/50 mt-1">{f.desc}</p>
                        </GlassCard>
                    ))}
                </div>
            </section>
            </Reveal>

            {/* FAQ */}
            {faqs.length > 0 && (
                <Reveal>
                <section id="faq" className="mx-auto max-w-6xl px-6 mb-24 relative">
                    <div className="grid sm:grid-cols-5 gap-10 items-start">
                        <div className="sm:col-span-3">
                            <div className="space-y-3">
                                {faqs.map((faq, index) => (
                                    <GlassCard key={index} className={`overflow-hidden ${openFaq === index ? '!border-crimson/40' : ''}`}>
                                        <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between px-5 py-4 text-left gap-3">
                                            <div className="flex items-center gap-3">
                                                {faq.category && (
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple/20 text-purple flex-shrink-0">
                                                        {faq.category}
                                                    </span>
                                                )}
                                                <span className="font-medium text-white text-sm">{faq.q}</span>
                                            </div>
                                            <ChevronDown size={18} className={`text-white/40 transition-transform flex-shrink-0 ml-2 ${openFaq === index ? 'rotate-180' : ''}`} />
                                        </button>
                                        {openFaq === index && (
                                            <p className="px-5 pb-4 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                                        )}
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                        <div className="sm:col-span-2 text-left">
                            <SectionKicker label="FAQ" />
                            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white mb-2">
                                Masih Punya Pertanyaan?
                            </h2>
                            <p className="text-white/50 mb-6">
                                Sebelum kirim laporan, mungkin ada beberapa hal yang perlu kamu tahu.
                            </p>
                            <a
                                href={`mailto:${footer.email}`}
                                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/20 transition whitespace-nowrap"
                            >
                                <Mail size={16} /> Hubungi Admin
                            </a>
                        </div>
                    </div>
                </section>
                </Reveal>
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
                    Sekolah yang Lebih Baik, Dimulai dari Suara Kita.
                </h2>
                <p className="text-white/50 mb-8 max-w-md mx-auto">
                    Punya masalah untuk disampaikan? Ada ide yang ingin diwujudkan? Jangan cuma dipendam — jadilah bagian dari perubahan di sekolah kita.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={canLogin ? route('login') : route('register')}
                        className="bg-crimson text-white font-semibold px-6 py-3 rounded-full hover:bg-crimson-dark transition shadow-[0_4px_20px_rgba(255,1,143,0.35)]"
                    >
                        Sampaikan Aspirasi
                    </Link>
                    <Link
                        href={route('track.index')}
                        className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition"
                    >
                        Lacak Laporan
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
                        <div className="flex items-center flex-shrink-0">
                            <img src="/images/SIAP-SMEKDA.png" alt="SIAP SMEKDA" className="h-20 w-auto" />
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