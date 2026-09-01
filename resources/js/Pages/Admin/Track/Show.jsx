import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, MessageCircle, Star } from 'lucide-react';

const statusMap = {
    terkirim:   { label: 'Terkirim',    color: 'bg-yellow-100 text-yellow-700' },
    diterima:   { label: 'Diterima',    color: 'bg-blue-100 text-blue-700' },
    diproses:   { label: 'Diproses',    color: 'bg-marble/30 text-navy' },
    ditanggapi: { label: 'Ditanggapi',  color: 'bg-purple-100 text-purple-700' },
    selesai:    { label: 'Selesai',     color: 'bg-green-100 text-green-700' },
    ditolak:    { label: 'Ditolak',     color: 'bg-red-100 text-crimson' },
    diblokir:   { label: 'Diblokir',    color: 'bg-gray-800 text-white' },
};

export default function TrackShow({ report }) {
    const status = statusMap[report.status] ?? { label: report.status, color: 'bg-gray-100 text-gray-700' };

    return (
        <div className="min-h-screen bg-cream">
            <Head title={`Lacak ${report.code} - SIAP SMEKDA`} />

            <nav className="bg-navy">
                <div className="mx-auto max-w-3xl px-6 py-4">
                    <Link href={route('track.index')} className="text-white text-sm flex items-center gap-1.5 hover:text-marble-light transition w-fit">
                        <ArrowLeft size={16} /> Lacak Kode Lain
                    </Link>
                </div>
            </nav>

            <div className="mx-auto max-w-2xl px-6 py-12">
                {/* Header card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 className="font-semibold text-navy mb-4 flex items-center gap-2">
                            <Clock size={18} /> Riwayat Status
                        </h2>
                        <div className="space-y-4">
                            {report.histories.map((h, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-1">
                                        <CheckCircle2 size={16} className="text-marble-dark" />
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 className="font-semibold text-navy mb-4 flex items-center gap-2">
                            <MessageCircle size={18} /> Tanggapan
                        </h2>
                        <div className="space-y-4">
                            {report.responses.map((r, i) => (
                                <div key={i} className="bg-cream rounded-lg p-4">
                                    <p className="text-sm text-gray-700">{r.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">{r.created_at}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rating jika sudah ada */}
                {report.rating && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-semibold text-navy mb-3 flex items-center gap-2">
                            <Star size={18} /> Rating Kamu
                        </h2>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={i < report.rating.score ? 'text-marble-dark fill-marble-dark' : 'text-gray-200'}
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
            </div>
        </div>
    );
}