import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, ThumbsUp, MessageSquare, Send, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

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

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

function ReportBody({ report, isLoggedIn }) {
    const { flash } = usePage().props;
    const commentForm = useForm({ message: '' });

    const toggleLike = () => {
        if (!isLoggedIn) {
            router.visit(route('login'));
            return;
        }
        router.post(route('sorotan.like', report.code), {}, { preserveScroll: true, preserveState: true });
    };

    const submitComment = (e) => {
        e.preventDefault();
        commentForm.post(route('sorotan.comments.store', report.code), {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    };

    return (
        <div className="space-y-5 max-w-3xl mx-auto">
            {flash?.success && (
                <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 size={16} className="shrink-0" />
                    {flash.success}
                </div>
            )}

            {/* DETAIL LAPORAN */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/5">
                <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-purple/10 text-purple text-xs font-semibold px-3 py-1 rounded-full">
                            {report.category ?? 'Umum'}
                        </span>
                        <span className="font-mono text-xs text-gray-400">{report.code}</span>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[report.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {statusLabel[report.status] ?? report.status}
                    </span>
                </div>

                <h1 className="text-xl font-bold text-navy mb-2">{report.title}</h1>
                <p className="text-sm text-gray-600 whitespace-pre-line mb-4">{report.description}</p>

                <p className="text-xs text-gray-400 mb-4">
                    Dilaporkan oleh {report.reporter_name} · {report.created_at}
                    {report.destination && ` · Ditujukan ke ${report.destination}`}
                </p>

                <div className="flex items-center gap-5 text-sm pt-4 border-t border-navy/5">
                    <button
                        onClick={toggleLike}
                        className={`flex items-center gap-1.5 font-medium transition-colors ${
                            report.is_liked ? 'text-crimson' : 'text-gray-400 hover:text-crimson'
                        }`}
                    >
                        <ThumbsUp size={16} fill={report.is_liked ? 'currentColor' : 'none'} />
                        {report.likes_count} Suka
                    </button>
                    <span className="flex items-center gap-1.5 text-gray-400">
                        <MessageSquare size={16} /> {report.comments_count} Komentar
                    </span>
                </div>
            </div>

            {/* TANGGAPAN RESMI */}
            {report.responses?.length > 0 && (
                <div className="bg-navy/[0.03] rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <h3 className="text-sm font-semibold text-navy">Tanggapan Resmi</h3>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                        {report.responses.map((r, i) => (
                            <div key={i} className="text-sm">
                                <p className="text-navy">{r.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{r.created_at}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* KOMENTAR */}
            <div className="bg-navy/[0.03] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <span className="w-2 h-2 rounded-full bg-purple" />
                    <h3 className="text-sm font-semibold text-navy">Komentar ({report.comments_count})</h3>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    {report.comments?.length === 0 && (
                        <p className="text-sm text-gray-400 mb-4">Belum ada komentar. Jadi yang pertama!</p>
                    )}

                    <div className="space-y-3 mb-4">
                        {report.comments?.map((c) => (
                            <div key={c.id} className="p-3.5 rounded-xl bg-navy/[0.03] text-sm">
                                <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                                    <span className="font-semibold text-navy/70">{c.user_name}</span>
                                    <span>{c.created_at}</span>
                                </div>
                                <p className="text-navy">{c.message}</p>
                            </div>
                        ))}
                    </div>

                    {isLoggedIn ? (
                        <form onSubmit={submitComment} className="space-y-2.5 pt-4 border-t border-navy/5">
                            <textarea
                                rows={2}
                                value={commentForm.data.message}
                                onChange={(e) => commentForm.setData('message', e.target.value)}
                                placeholder="Tulis komentar..."
                                className={inputClass}
                            />
                            {commentForm.errors.message && (
                                <p className="text-xs text-crimson">{commentForm.errors.message}</p>
                            )}
                            <button
                                type="submit"
                                disabled={commentForm.processing}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                            >
                                <Send size={14} /> Kirim Komentar
                            </button>
                        </form>
                    ) : (
                        <Link
                            href={route('login')}
                            className="flex items-center justify-center gap-2 py-4 mt-2 text-sm font-medium text-navy/60 bg-navy/[0.03] rounded-xl hover:bg-navy/[0.06] transition-colors"
                        >
                            <Lock size={14} /> Masuk untuk berkomentar
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SorotanShow({ report }) {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;
    const isAdmin = auth?.user?.role === 'admin';

    if (isAdmin) {
        return (
            <AdminLayout title="Sorotan Publik" subtitle={report.title}>
                <Head title={`${report.title} - Sorotan Publik`} />
                <Link
                    href={route('sorotan.index')}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-crimson hover:text-crimson-dark mb-4"
                >
                    <ArrowLeft size={15} /> Kembali ke Sorotan Publik
                </Link>
                <ReportBody report={report} isLoggedIn={isLoggedIn} />
            </AdminLayout>
        );
    }

    if (isLoggedIn) {
        return (
            <UserLayout title="Sorotan Publik" subtitle={report.title} showSearch={false}>
                <Head title={`${report.title} - Sorotan Publik`} />
                <Link
                    href={route('sorotan.index')}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-crimson hover:text-crimson-dark mb-4"
                >
                    <ArrowLeft size={15} /> Kembali ke Sorotan Publik
                </Link>
                <ReportBody report={report} isLoggedIn={isLoggedIn} />
            </UserLayout>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9fc] flex flex-col relative overflow-hidden">
            <Head title={`${report.title} - Sorotan Publik`} />

            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -right-16 w-80 h-80 bg-crimson/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple/10 rounded-full blur-[100px]" />
            </div>

            <nav className="bg-navy">
                <div className="mx-auto max-w-3xl px-6 py-4">
                    <Link
                        href={route('sorotan.index')}
                        className="inline-flex items-center gap-1.5 text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors w-fit"
                    >
                        <ArrowLeft size={15} /> Kembali ke Sorotan Publik
                    </Link>
                </div>
            </nav>

            <div className="flex-1 px-6 py-12">
                <ReportBody report={report} isLoggedIn={isLoggedIn} />
            </div>
        </div>
    );
}
