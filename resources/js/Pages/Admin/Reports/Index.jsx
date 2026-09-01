import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Inbox, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';

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

const selectClass =
    'rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap gap-1.5 justify-center py-2">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true, preserveState: true })}
                    className={`min-w-[2.25rem] px-3 py-1.5 text-sm rounded-full transition-colors ${
                        link.active
                            ? 'bg-crimson text-white'
                            : 'bg-navy/5 text-navy/60 hover:bg-navy/10'
                    } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

export default function Index({ reports, categories, statuses, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilter = (key, value) => {
        router.get(
            route('admin.reports.index'),
            { ...filters, search, [key]: value },
            { preserveState: true }
        );
    };

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilter('search', search);
    };

    const destroy = (report) => {
        if (confirm(`Yakin mau hapus aduan "${report.code}"? Tindakan ini tidak bisa dibatalkan.`)) {
            router.delete(route('admin.reports.destroy', report.id));
        }
    };

    return (
        <AdminLayout
            title="Kelola Aduan"
            subtitle="Kelola semua aduan dan aspirasi yang masuk dari pengguna."
        >
            <Head title="Kelola Aduan" />

            <div className="space-y-5">
                {flash?.success && (
                    <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        <CheckCircle2 size={16} className="shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* FILTERS */}
                <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
                    <form onSubmit={submitSearch} className="flex gap-2 flex-1 min-w-[220px]">
                        <div className="flex-1 flex items-center gap-2 bg-navy/[0.02] border border-navy/10 rounded-xl px-3.5 focus-within:border-crimson transition-colors">
                            <Search size={15} className="text-gray-400 shrink-0" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode / judul aduan..."
                                className="flex-1 border-0 bg-transparent focus:ring-0 text-sm text-navy placeholder-gray-400 py-2.5 px-0"
                            />
                        </div>
                        <button className="px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors whitespace-nowrap">
                            Cari
                        </button>
                    </form>

                    <select
                        value={filters.status ?? ''}
                        onChange={(e) => applyFilter('status', e.target.value)}
                        className={selectClass}
                    >
                        <option value="">Semua Status</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {statusLabel[status] ?? status}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.category_id ?? ''}
                        onChange={(e) => applyFilter('category_id', e.target.value)}
                        className={selectClass}
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-navy/[0.03]">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Kode</th>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Judul</th>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Kategori</th>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Pelapor</th>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Tanggapan</th>
                                    <th className="px-4 py-3 text-right font-semibold text-navy/60 text-xs uppercase tracking-wide">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy/5">
                                {reports.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <Inbox className="text-gray-200 mb-3" size={30} />
                                                <p className="text-sm text-gray-400">Tidak ada aduan yang cocok.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {reports.data.map((report) => (
                                    <tr key={report.id} className="hover:bg-navy/[0.02] transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{report.code}</td>
                                        <td className="px-4 py-3 text-navy font-medium max-w-xs truncate">{report.title}</td>
                                        <td className="px-4 py-3 text-gray-500">{report.category?.name ?? '-'}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {report.is_anonymous ? 'Anonim' : report.user?.name ?? report.reporter_name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[report.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {statusLabel[report.status] ?? report.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{report.responses_count ?? 0}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={route('admin.reports.show', report.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-crimson hover:bg-crimson/10 transition-colors"
                                                >
                                                    Kelola <ArrowRight size={12} />
                                                </Link>
                                                <button
                                                    onClick={() => destroy(report)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-crimson/60 hover:bg-crimson/10 hover:text-crimson transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {reports.data.length > 0 && (
                        <div className="border-t border-navy/5">
                            <Pagination links={reports.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}