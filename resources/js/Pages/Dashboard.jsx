import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Inbox,
    Clock,
    CheckCircle2,
    XCircle,
    Plus,
    ArrowRight,
    LogOut,
    Search,
    ListChecks,
} from 'lucide-react';

const statusLabel = {
    terkirim: 'Terkirim',
    diterima: 'Diterima',
    diproses: 'Diproses',
    ditanggapi: 'Ditanggapi',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
    diblokir: 'Diblokir',
};

const statusStyle = {
    terkirim: 'bg-gray-100 text-gray-600',
    diterima: 'bg-purple/15 text-purple',
    diproses: 'bg-gold/20 text-[#8a6d00]',
    ditanggapi: 'bg-purple/15 text-purple',
    selesai: 'bg-emerald-100 text-emerald-700',
    ditolak: 'bg-crimson/10 text-crimson',
    diblokir: 'bg-navy text-white',
};

const barColor = ['bg-crimson', 'bg-purple', 'bg-gold', 'bg-navy-light', 'bg-emerald-500'];

function PastelStat({ label, value, icon: Icon, bg, iconBg, iconColor }) {
    return (
        <div className={`rounded-2xl p-5 ${bg}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>
                <Icon size={18} className={iconColor} strokeWidth={2.25} />
            </div>
            <p className="text-2xl font-extrabold text-navy leading-none">{value}</p>
            <p className="text-xs text-navy/50 mt-2">{label}</p>
        </div>
    );
}

function ColumnHeader({ label, dot }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            <h3 className="text-sm font-semibold text-navy">{label}</h3>
        </div>
    );
}

function QuickLink({ href, label, icon: Icon, iconBg, iconColor }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 bg-white border border-navy/5 rounded-2xl p-4 hover:border-crimson/30 hover:-translate-y-0.5 hover:shadow-md transition-all"
        >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                <Icon size={16} className={iconColor} />
            </div>
            <span className="text-sm font-medium text-navy">{label}</span>
            <ArrowRight size={14} className="ml-auto text-gray-300" />
        </Link>
    );
}

export default function Dashboard() {
    const { auth, stats, recentReports, categoryBreakdown } = usePage().props;
    const user = auth.user;

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const total = stats.total || 0;
    const selesaiPct = total ? Math.round((stats.selesai / total) * 100) : 0;
    const maxCategory = categoryBreakdown?.length
        ? Math.max(...categoryBreakdown.map((c) => c.count), 1)
        : 1;

    const breakdown = [
        { label: 'Selesai', value: stats.selesai, color: 'bg-emerald-500' },
        { label: 'Diproses', value: stats.diproses, color: 'bg-gold' },
        { label: 'Ditolak', value: stats.ditolak, color: 'bg-crimson' },
        { label: 'Diblokir', value: stats.diblokir, color: 'bg-navy' },
    ];

    return (
        <div className="min-h-screen relative">
            <Head title="Dashboard" />

            {/* Background solid deep navy + subtle glow, konsisten sama Track/Landing */}
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

                {/* Stat cards pastel — sama persis gaya PastelStat di dashboard admin */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    <PastelStat label="Total Laporan" value={stats.total} icon={Inbox} bg="bg-white" iconBg="bg-purple/15" iconColor="text-purple" />
                    <PastelStat label="Sedang Diproses" value={stats.diproses} icon={Clock} bg="bg-white" iconBg="bg-gold/20" iconColor="text-[#8a6d00]" />
                    <PastelStat label="Selesai" value={stats.selesai} icon={CheckCircle2} bg="bg-white" iconBg="bg-emerald-100" iconColor="text-emerald-600" />
                    <PastelStat label="Ditolak" value={stats.ditolak} icon={XCircle} bg="bg-white" iconBg="bg-crimson/10" iconColor="text-crimson" />
                </div>

                {/* Board-style columns — sama pola dengan dashboard admin */}
                <div className="grid lg:grid-cols-3 gap-5 mb-8">
                    {/* Distribusi status */}
                    <div className="bg-white/[0.04] rounded-2xl p-4">
                        <ColumnHeader label="Distribusi Status" dot="bg-emerald-400" />
                        <div className="bg-white rounded-2xl p-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)]">
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `conic-gradient(#10b981 0% ${selesaiPct}%, #f1edf8 ${selesaiPct}% 100%)`,
                                    }}
                                />
                                <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center">
                                    <span className="text-xl font-extrabold text-navy">{selesaiPct}%</span>
                                    <span className="text-[10px] text-gray-400">Selesai</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {breakdown.map((b) => (
                                    <div key={b.label}>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-gray-500">{b.label}</span>
                                            <span className="font-semibold text-navy">{b.value}/{total}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-navy/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${b.color}`}
                                                style={{ width: total ? `${(b.value / total) * 100}%` : '0%' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Kategori laporan saya */}
                    <div className="bg-white/[0.04] rounded-2xl p-4">
                        <ColumnHeader label="Kategori Laporan Saya" dot="bg-purple" />
                        <div className="bg-white rounded-2xl p-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] h-full">
                            {categoryBreakdown?.length > 0 ? (
                                <div className="space-y-4">
                                    {categoryBreakdown.map((c, i) => (
                                        <div key={c.name}>
                                            <div className="flex items-center justify-between text-sm mb-1.5">
                                                <span className="text-gray-600">{c.name}</span>
                                                <span className="font-semibold text-navy">{c.count}</span>
                                            </div>
                                            <div className="h-2 w-full bg-navy/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${barColor[i % barColor.length]}`}
                                                    style={{ width: `${(c.count / maxCategory) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                                    <Inbox className="text-gray-200 mb-3" size={30} />
                                    <p className="text-gray-400 text-sm">Belum ada laporan buat ditampilin di sini.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Laporan terbaru */}
                    <div className="bg-white/[0.04] rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <ColumnHeader label="Laporan Terbaru" dot="bg-crimson" />
                            <Link
                                href={route('reports.index')}
                                className="text-xs font-semibold text-crimson hover:text-crimson-dark flex items-center gap-1"
                            >
                                Semua <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="bg-white rounded-2xl p-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] min-h-[220px] flex flex-col">
                            {recentReports.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                                    <Inbox className="text-gray-200 mb-3" size={30} />
                                    <p className="text-gray-400 text-sm mb-3">Kamu belum pernah membuat laporan.</p>
                                    <Link
                                        href={route('reports.create')}
                                        className="inline-flex items-center gap-1.5 text-crimson font-semibold text-sm hover:text-crimson-dark transition"
                                    >
                                        Buat laporan pertamamu <ArrowRight size={14} />
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {recentReports.map((report) => (
                                        <Link
                                            key={report.id}
                                            href={route('track.show', report.code)}
                                            className="block px-2 py-2.5 rounded-xl hover:bg-navy/[0.03] transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm text-navy truncate">{report.title}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {report.code} · {report.created_at}
                                                    </p>
                                                </div>
                                                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${statusStyle[report.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {statusLabel[report.status] ?? report.status}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menu cepat */}
                <div>
                    <h2 className="font-semibold text-white mb-4">Menu Cepat</h2>
                    <div className="grid sm:grid-cols-3 gap-3">
                        <QuickLink href={route('reports.create')} label="Buat Aduan Baru" icon={Plus} iconBg="bg-crimson/10" iconColor="text-crimson" />
                        <QuickLink href={route('reports.index')} label="Semua Laporan Saya" icon={ListChecks} iconBg="bg-purple/15" iconColor="text-purple" />
                        <QuickLink href={route('track.index')} label="Lacak Aduan Lain" icon={Search} iconBg="bg-gold/20" iconColor="text-[#8a6d00]" />
                    </div>
                </div>
            </main>
        </div>
    );
}