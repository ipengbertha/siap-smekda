import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, MessageSquare, Pencil, Trash2, Check, X, CheckCircle2, AlertCircle } from 'lucide-react';

function SectionCard({ label, dot, children }) {
    return (
        <div className="bg-navy/[0.03] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4 px-1">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <h3 className="text-sm font-semibold text-navy">{label}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">{children}</div>
        </div>
    );
}

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap gap-1.5 justify-center pt-2">
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

export default function Index({ responses, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [editingId, setEditingId] = useState(null);

    const editForm = useForm({ message: '' });

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.responses.index'), { search }, { preserveState: true });
    };

    const startEdit = (response) => {
        setEditingId(response.id);
        editForm.setData('message', response.message);
    };

    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route('admin.responses.update', id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const destroy = (response) => {
        if (confirm('Yakin mau hapus tanggapan ini?')) {
            router.delete(route('admin.responses.destroy', response.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout
            title="Kelola Tanggapan"
            subtitle="Kelola semua tanggapan yang sudah dikirim ke pelapor."
        >
            <Head title="Kelola Tanggapan" />

            <div className="space-y-5 max-w-4xl">
                {flash?.success && (
                    <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        <CheckCircle2 size={16} className="shrink-0" />
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2.5 rounded-xl bg-crimson/10 px-4 py-3 text-sm text-crimson">
                        <AlertCircle size={16} className="shrink-0" />
                        {flash.error}
                    </div>
                )}

                {/* SEARCH */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <form onSubmit={submitSearch} className="flex gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-navy/[0.02] border border-navy/10 rounded-xl px-3.5 focus-within:border-crimson transition-colors">
                            <Search size={15} className="text-gray-400 shrink-0" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode aduan atau isi tanggapan..."
                                className="flex-1 border-0 bg-transparent focus:ring-0 text-sm text-navy placeholder-gray-400 py-2.5 px-0"
                            />
                        </div>
                        <button className="px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors whitespace-nowrap">
                            Cari
                        </button>
                    </form>
                </div>

                {/* DAFTAR TANGGAPAN */}
                <SectionCard label="Daftar Tanggapan" dot="bg-purple">
                    {responses.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <MessageSquare className="text-gray-200 mb-3" size={30} />
                            <p className="text-sm text-gray-400">Belum ada tanggapan.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {responses.data.map((response) => (
                                <div
                                    key={response.id}
                                    className="rounded-xl border border-navy/5 p-3 sm:p-4 hover:border-crimson/20 transition-colors"
                                >
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                        <Link
                                            href={route('admin.reports.show', response.report.id)}
                                            className="font-mono text-crimson hover:underline"
                                        >
                                            {response.report.code}
                                        </Link>
                                        <span>{response.user?.name ?? 'Admin'}</span>
                                    </div>
                                    <p className="text-sm text-navy font-medium truncate mb-2">{response.report.title}</p>

                                    {editingId === response.id ? (
                                        <form onSubmit={(e) => submitEdit(e, response.id)} className="space-y-3">
                                            <textarea
                                                rows={3}
                                                value={editForm.data.message}
                                                onChange={(e) => editForm.setData('message', e.target.value)}
                                                className={inputClass}
                                            />
                                            {editForm.errors.message && (
                                                <p className="text-xs text-crimson">{editForm.errors.message}</p>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={editForm.processing}
                                                    className="w-8 h-8 rounded-full bg-crimson/10 text-crimson flex items-center justify-center hover:bg-crimson/20 transition-colors"
                                                    title="Simpan"
                                                >
                                                    <Check size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(null)}
                                                    className="w-8 h-8 rounded-full bg-navy/5 text-navy/50 flex items-center justify-center hover:bg-navy/10 transition-colors"
                                                    title="Batal"
                                                >
                                                    <X size={15} />
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="bg-crimson/5 border border-crimson/10 rounded-xl p-3 text-sm text-navy">
                                                {response.message}
                                            </div>
                                            <div className="flex gap-1 mt-2 justify-end">
                                                <button
                                                    onClick={() => startEdit(response)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-navy/50 hover:bg-navy/5 hover:text-navy transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => destroy(response)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-crimson/60 hover:bg-crimson/10 hover:text-crimson transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <Pagination links={responses.links} />
                </SectionCard>
            </div>
        </AdminLayout>
    );
}