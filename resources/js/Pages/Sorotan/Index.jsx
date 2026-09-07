import { Head, Link, router, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, ThumbsUp, MessageSquare, Megaphone, Lock } from 'lucide-react';

const statusLabel = {
    terkirim: 'Terkirim',
    diterima: 'Diterima',
    diproses: 'Diproses',
    ditanggapi: 'Ditanggapi',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
};

const statusStyle = {
    terkirim: 'bg-gray-100 text-gray-600',
    diterima: 'bg-purple/15 text-purple',
    diproses: 'bg-gold/20 text-[#8a6d00]',
    ditanggapi: 'bg-purple/15 text-purple',
    selesai: 'bg-emerald-100 text-emerald-700',
    ditolak: 'bg-crimson/10 text-crimson',
};

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap gap-1.5 justify-center py-4">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true, preserveState: true })}
                    className={`min-w-[2.25rem] px-3 py-1.5 text-sm rounded-full transition-colors ${
                        link.active ? 'bg-crimson text-white' : 'bg-navy/5 text-navy/60 hover:bg-navy/10'
                    } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

function ReportCard({ report, isLoggedIn }) {
    const toggleLike = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            router.visit(route('login'));
            return;
        }
        router.post(route('sorotan.like', report.code), {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <Link
            href={route('sorotan.show', report.code)}
            className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-navy/5"
        >
            <div className="flex items-center justify-between mb-4 gap-2">
                <span className="bg-purple/10 text-purple text-xs font-semibold px-3 py-1 rounded-full truncate">
                    {report.category ?? 'Umum'}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${statusStyle[report.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel[report.status] ?? report.status}
                </span>
            </div>
            <p className="font-semibold text-navy leading-snug mb-1.5 line-clamp-2">{report.title}</p>
            <p className="text-xs text-gray-400 mb-4">
                {report.reporter_name} · {report.created_at}
            </p>
            <div className="flex items-center gap-4 text-sm pt-4 border-t border-navy/5">
                <button
                    onClick={toggleLike}
                    className={`flex items-center gap-1.5 transition-colors ${
                        report.is_liked ? 'text-crimson font-semibold' : 'text-gray-400 hover:text-crimson'
                    }`}
                >
                    <ThumbsUp size={14} fill={report.is_liked ? 'currentColor' : 'none'} /> {report.likes_count}
                </button>
                <span className="flex items-center gap-1.5 text-gray-400">
                    <MessageSquare size={14} /> {report.comments_count}
                </span>
            </div>
        </Link>
    );
}

function Feed({ reports, isLoggedIn }) {
    if (reports.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-2xl border border-navy/5">
                <Megaphone className="text-gray-200 mb-3" size={32} />
                <p className="text-sm text-gray-400">Belum ada laporan yang disorot admin.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {reports.data.map((report) => (
                    <ReportCard key={report.id} report={report} isLoggedIn={isLoggedIn} />
                ))}
            </div>
            <Pagination links={reports.links} />
        </>
    );
}

export default function SorotanIndex({ reports }) {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;
    const isAdmin = auth?.user?.role === 'admin';

    if (isAdmin) {
        return (
            <AdminLayout
                title="Sorotan Publik"
                subtitle="Laporan yang sedang tampil di halaman publik — pantau like & komentar dari sini."
            >
                <Head title="Sorotan Publik" />
                <Feed reports={reports} isLoggedIn={isLoggedIn} />
            </AdminLayout>
        );
    }

    if (isLoggedIn) {
        return (
            <UserLayout
                title="Sorotan Publik"
                subtitle="Laporan yang sudah ditindaklanjuti dan disorot admin — like & beri komentar."
                showSearch={false}
            >
                <Head title="Sorotan Publik" />
                <Feed reports={reports} isLoggedIn={isLoggedIn} />
            </UserLayout>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9fc] flex flex-col relative overflow-hidden">
            <Head title="Sorotan Publik - SIAP SMEKDA" />

            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -right-16 w-80 h-80 bg-crimson/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-15%] right-1/4 w-72 h-72 bg-gold/10 rounded-full blur-[100px]" />
            </div>

            <nav className="bg-navy">
                <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center gap-1.5 text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors w-fit"
                    >
                        <ArrowLeft size={15} /> Kembali ke Beranda
                    </Link>
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors"
                    >
                        <Lock size={14} /> Masuk untuk like & komentar
                    </Link>
                </div>
            </nav>

            <div className="flex-1 px-6 py-12">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-crimson/10 text-crimson mb-4">
                            <Megaphone size={22} />
                        </div>
                        <h1 className="text-2xl font-bold text-navy">Sorotan Publik</h1>
                        <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                            Laporan yang sudah diverifikasi dan ditindaklanjuti — bukti transparansi penanganan aduan.
                        </p>
                    </div>

                    <Feed reports={reports} isLoggedIn={isLoggedIn} />
                </div>
            </div>
        </div>
    );
}
