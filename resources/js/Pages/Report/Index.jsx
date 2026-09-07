import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Inbox, Plus, ArrowRight, Pencil, Trash2 } from 'lucide-react';

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

export default function Index({ reports }) {
    const handleDelete = (report) => {
        if (!confirm(`Yakin mau hapus aduan "${report.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
            return;
        }
        router.delete(route('reports.destroy', report.id));
    };

    return (
        <UserLayout
            title="Laporan Saya"
            subtitle="Daftar aduan & aspirasi yang sudah kamu kirim."
            headerAction={
                <Link
                    href={route('reports.create')}
                    className="inline-flex items-center gap-2 bg-crimson text-white font-semibold px-5 py-2.5 rounded-full hover:bg-crimson-dark active:scale-95 transition-all"
                >
                    <Plus size={18} /> Buat Laporan
                </Link>
            }
        >
            <Head title="Laporan Saya" />

            {reports.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                    <Inbox className="mx-auto text-gray-200 mb-3" size={32} />
                    <p className="text-sm text-gray-400 mb-3">Belum ada laporan yang kamu kirim.</p>
                    <Link
                        href={route('reports.create')}
                        className="inline-flex items-center gap-1.5 text-crimson font-semibold text-sm hover:text-crimson-dark transition"
                    >
                        Buat laporan pertamamu <ArrowRight size={14} />
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-navy/5 overflow-hidden">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="group flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-navy/[0.02] transition-colors"
                        >
                            <Link
                                href={route('track.show', report.code)}
                                className="flex-1 min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson/30 rounded-lg"
                            >
                                <p className="text-xs text-gray-400 font-mono mb-1">
                                    {report.code}
                                </p>
                                <p className="font-medium text-navy truncate">
                                    {report.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {report.category?.name}
                                </p>
                            </Link>

                            <div className="flex items-center gap-3 shrink-0">
                                {(report.can_edit || report.can_delete) && (
                                    <div className="hidden sm:flex items-center gap-1.5">
                                        {report.can_edit && (
                                            <Link
                                                href={route('reports.edit', report.id)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-navy/40 hover:bg-navy/5 hover:text-navy transition-colors"
                                                title="Edit aduan"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                        )}
                                        {report.can_delete && (
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(report)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-navy/40 hover:bg-crimson/10 hover:text-crimson transition-colors"
                                                title="Hapus aduan"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                )}

                                <Link
                                    href={route('track.show', report.code)}
                                    className="flex flex-col items-end gap-1.5"
                                >
                                    <span
                                        className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                                            statusStyle[report.status] ?? 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {statusLabel[report.status] ?? report.status}
                                    </span>
                                    <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-crimson transition-colors">
                                        Lihat Detail <ArrowRight size={12} />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}