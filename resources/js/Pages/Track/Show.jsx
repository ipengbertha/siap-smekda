import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, MessageCircle, Star } from 'lucide-react';
import UserLayout from '@/Layouts/UserLayout';

const statusMap = {
    terkirim:   { label: 'Terkirim',    color: 'bg-gray-100 text-gray-600' },
    diterima:   { label: 'Diterima',    color: 'bg-purple/15 text-purple' },
    diproses:   { label: 'Diproses',    color: 'bg-gold/20 text-[#8a6d00]' },
    ditanggapi: { label: 'Ditanggapi',  color: 'bg-purple/15 text-purple' },
    selesai:    { label: 'Selesai',     color: 'bg-emerald-100 text-emerald-700' },
    ditolak:    { label: 'Ditolak',     color: 'bg-crimson/10 text-crimson' },
    diblokir:   { label: 'Diblokir',    color: 'bg-navy text-white' },
};

function TrackShowContent({ report, status }) {
    return (
        <>
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-navy/5 shadow-[0_10px_40px_-15px_rgba(17,1,46,0.15)] p-6 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">{report.code}</p>
                        <h1 className="text-xl font-bold text-navy mt-1">{report.title}</h1>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap ${status.color}`}>
                        {status.label}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mt-4">{report.description}</p>

                <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs">Kategori</p>
                        <p className="text-navy font-medium mt-0.5">{report.category ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Tujuan</p>
                        <p className="text-navy font-medium mt-0.5">{report.destination ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Pelapor</p>
                        <p className="text-navy font-medium mt-0.5">
                            {report.is_anonymous ? 'Anonim' : (report.reporter_name ?? '-')}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Dikirim</p>
                        <p className="text-navy font-medium mt-0.5">{report.created_at}</p>
                    </div>
                </div>
            </div>

            {/* Riwayat status */}
            {report.histories?.length > 0 && (
                <div className="bg-white rounded-2xl border border-navy/5 shadow-[0_10px_40px_-15px_rgba(17,1,46,0.15)] p-6 mb-6">
                    <h2 className="font-semibold text-navy mb-4 flex items-center gap-2">
                        <Clock size={18} /> Riwayat Status
                    </h2>
                    <div className="space-y-4">
                        {report.histories.map((h, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="mt-1">
                                    <CheckCircle2 size={16} className="text-purple" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-navy">
                                        {statusMap[h.status]?.label ?? h.status}
                                    </p>
                                    {h.note && <p className="text-sm text-gray-500 mt-0.5">{h.note}</p>}
                                    <p className="text-xs text-gray-400 mt-0.5">{h.created_at}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tanggapan admin */}
            {report.responses?.length > 0 && (
                <div className="bg-white rounded-2xl border border-navy/5 shadow-[0_10px_40px_-15px_rgba(17,1,46,0.15)] p-6 mb-6">
                    <h2 className="font-semibold text-navy mb-4 flex items-center gap-2">
                        <MessageCircle size={18} /> Tanggapan
                    </h2>
                    <div className="space-y-4">
                        {report.responses.map((r, i) => (
                            <div key={i} className="bg-crimson/5 border border-crimson/10 rounded-lg p-4">
                                <p className="text-sm text-navy">{r.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{r.created_at}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating jika sudah ada */}
            {report.rating && (
                <div className="bg-white rounded-2xl border border-navy/5 shadow-[0_10px_40px_-15px_rgba(17,1,46,0.15)] p-6">
                    <h2 className="font-semibold text-navy mb-3 flex items-center gap-2">
                        <Star size={18} /> Rating Kamu
                    </h2>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={18}
                                className={i < report.rating.score ? 'text-gold fill-gold' : 'text-gray-200'}
                            />
                        ))}
                    </div>
                    {report.rating.is_resolved && (
                        <p className="text-xs text-gray-400 mt-2">
                            Masalah terselesaikan: {' '}
                            <span className="font-medium text-navy">
                                {{ ya: 'Ya', sebagian: 'Sebagian', belum: 'Belum' }[report.rating.is_resolved]}
                            </span>
                        </p>
                    )}
                    {report.rating.comment && (
                        <p className="text-sm text-gray-500 mt-2">{report.rating.comment}</p>
                    )}
                </div>
            )}
        </>
    );
}

export default function TrackShow({ report }) {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;
    const status = statusMap[report.status] ?? { label: report.status, color: 'bg-gray-100 text-gray-700' };

    // User yang login: nyatu di dalam UserLayout (sidebar + topbar), tanpa nav/background terpisah.
    if (isLoggedIn) {
        return (
            <UserLayout
                title={report.title}
                subtitle={`${report.code} · ${status.label}`}
                headerAction={
                    <Link
                        href={route('reports.index')}
                        className="inline-flex items-center gap-1.5 text-navy text-sm font-medium bg-navy/5 hover:bg-navy/10 px-4 py-2 rounded-full transition-colors w-fit"
                    >
                        <ArrowLeft size={15} /> Laporan Saya
                    </Link>
                }
            >
                <Head title={`Lacak ${report.code} - SIAP SMEKDA`} />
                <div className="max-w-2xl">
                    <TrackShowContent report={report} status={status} />
                </div>
            </UserLayout>
        );
    }

    // Tamu (belum login): tetap halaman standalone.
    return (
        <div className="min-h-screen bg-[#faf9fc] relative overflow-hidden">
            <Head title={`Lacak ${report.code} - SIAP SMEKDA`} />

            {/* Aksen gradasi blur halus di background, konsisten dengan warna brand */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -right-16 w-80 h-80 bg-crimson/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-15%] right-1/4 w-72 h-72 bg-gold/10 rounded-full blur-[100px]" />
            </div>

            <nav className="bg-navy">
                <div className="mx-auto max-w-3xl px-6 py-4">
                    <Link
                        href={route('track.index')}
                        className="inline-flex items-center gap-1.5 text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors w-fit"
                    >
                        <ArrowLeft size={15} /> Lacak Kode Lain
                    </Link>
                </div>
            </nav>

            <div className="mx-auto max-w-2xl px-6 py-12">
                <TrackShowContent report={report} status={status} />
            </div>
        </div>
    );
}