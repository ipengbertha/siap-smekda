import { Head, Link, router, usePage } from '@inertiajs/react';
import { Inbox, Clock, CheckCircle2, XCircle, Plus, ArrowRight, LogOut } from 'lucide-react';

const statusLabel = {
    terkirim: 'Terkirim',
    diverifikasi: 'Diverifikasi',
    diproses: 'Diproses',
    ditindaklanjuti: 'Ditindaklanjuti',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
};

const statusStyle = {
    terkirim: 'bg-white/10 text-white/70',
    diverifikasi: 'bg-gold/15 text-gold/80',
    diproses: 'bg-gold/15 text-gold/80',
    ditindaklanjuti: 'bg-gold/15 text-gold/80',
    selesai: 'bg-emerald-500/15 text-emerald-400/90',
    ditolak: 'bg-crimson/15 text-crimson/90',
};

function StatCard({ label, value, icon: Icon, glow, iconBg }) {
    return (
        <div className="relative bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden">
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl ${glow}`}></div>
            <div className={`relative w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center mb-5`}>
                <Icon size={20} className="text-white" />
            </div>
            <p className="relative font-sans text-3xl font-bold text-white mb-1">{value}</p>
            <p className="relative text-xs text-white/50">{label}</p>
        </div>
    );
}

export default function Dashboard() {
    const { auth, stats, recentReports } = usePage().props;
    const user = auth.user;

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen relative">
            <Head title="Dashboard" />

            {/* Background solid deep navy + subtle glow, mood lebih "app dashboard" */}
                <div className="fixed inset-0 -z-10 overflow-hidden bg-navy">
                    <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-crimson/8 rounded-full blur-[160px]"></div>
                    <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-purple/8 rounded-full blur-[160px]"></div>
                </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-20 bg-white/[0.04] backdrop-blur-xl border-b border-white/10">
                <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center flex-shrink-0">
                        <img src="/images/SIAP-SMEKDA.png" alt="SIAP SMEKDA" className="h-12 w-auto" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-white/60 hidden sm:inline">
                            Halo, <span className="font-bold text-white">{user.name}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-crimson transition"
                        >
                            <LogOut size={16} /> Keluar
                        </button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-5xl px-6 py-10 relative">
                {/* Header + tombol buat aduan */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">Dashboard Saya</h1>
                        <p className="text-white/50 text-sm mt-1">
                            Pantau laporan dan aspirasi yang sudah kamu sampaikan.
                        </p>
                    </div>
                    <Link
                        href={route('reports.create')}
                        className="inline-flex items-center gap-2 bg-crimson text-white font-semibold px-5 py-2.5 rounded-full hover:bg-crimson-dark active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,1,143,0.35)] w-fit"
                    >
                        <Plus size={18} /> Buat Aduan
                    </Link>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    <StatCard
                        label="Total Laporan"
                        value={stats.total}
                        icon={Inbox}
                        iconBg="bg-purple/50"
                        glow="bg-transparent"
                    />
                    <StatCard
                        label="Sedang Diproses"
                        value={stats.diproses}
                        icon={Clock}
                        iconBg="bg-gold/50"
                        glow="bg-transparent"
                    />
                    <StatCard
                        label="Selesai"
                        value={stats.selesai}
                        icon={CheckCircle2}
                        iconBg="bg-emerald-500/50"
                        glow="bg-transparent"
                    />
                    <StatCard
                        label="Ditolak"
                        value={stats.ditolak}
                        icon={XCircle}
                        iconBg="bg-crimson/50"
                        glow="bg-transparent"
                    />
                    </div>

                {/* Laporan terbaru */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-sans font-extrabold text-lg sm:text-xl text-white">Laporan Terbaru</h2>
                    <Link
                        href={route('reports.index')}
                        className="text-sm font-semibold text-gold hover:text-white flex items-center gap-1 transition"
                    >
                        Lihat Semua <ArrowRight size={14} />
                    </Link>
                </div>

                {recentReports.length === 0 ? (
                    <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center">
                        <Inbox className="mx-auto text-white/20 mb-3" size={32} />
                        <p className="text-white/50 text-sm">Kamu belum pernah membuat laporan.</p>
                        <Link
                            href={route('reports.create')}
                            className="inline-flex items-center gap-1.5 text-gold font-semibold text-sm mt-3 hover:text-white transition"
                        >
                            Buat laporan pertamamu <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="font-mono text-xs text-white/40">{report.code}</span>
                                            {report.category && (
                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                                                    {report.category}
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-medium text-white">{report.title}</p>
                                        <p className="text-xs text-white/40 mt-1">
                                            {report.destination ? `Ditujukan ke ${report.destination} · ` : ''}{report.created_at}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${statusStyle[report.status]}`}>
                                        {statusLabel[report.status]}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}