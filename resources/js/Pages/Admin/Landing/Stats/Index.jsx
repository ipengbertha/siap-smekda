import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronUp, ChevronDown, Pencil, Trash2, Check, X, BarChart3 } from 'lucide-react';

function SectionCard({ label, dot, description, children }) {
    return (
        <div className="bg-navy/[0.03] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4 px-1">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <h3 className="text-sm font-semibold text-navy">{label}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
                {description && <p className="text-sm text-gray-500 mb-5">{description}</p>}
                {children}
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-navy/70 mb-1.5">{label}</label>
            {children}
            {error && <p className="mt-1.5 text-xs text-crimson">{error}</p>}
        </div>
    );
}

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

export default function Index({ stats }) {
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({ label: '', value: '' });
    const editForm = useForm({ label: '', value: '', is_active: true });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.landing.stats.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const startEdit = (stat) => {
        setEditingId(stat.id);
        editForm.setData({ label: stat.label, value: stat.value, is_active: stat.is_active });
    };

    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route('admin.landing.stats.update', id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const destroy = (id) => {
        if (confirm('Yakin mau hapus statistik ini?')) {
            router.delete(route('admin.landing.stats.destroy', id));
        }
    };

    const move = (index, direction) => {
        const newStats = [...stats];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newStats.length) return;

        [newStats[index], newStats[targetIndex]] = [newStats[targetIndex], newStats[index]];
        router.post(
            route('admin.landing.stats.reorder'),
            { ids: newStats.map((s) => s.id) },
            { preserveScroll: true }
        );
    };

    return (
        <AdminLayout
            title="Statistik"
            subtitle="Kelola angka-angka statistik yang tampil di landing page."
        >
            <Head title="Kelola Statistik" />

            <div className="space-y-5 max-w-3xl">
                {/* FORM TAMBAH */}
                <SectionCard label="Tambah Statistik Baru" dot="bg-crimson">
                    <form onSubmit={submitCreate} className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="flex-1 w-full">
                            <Field label="Label" error={createForm.errors.label}>
                                <input
                                    type="text"
                                    value={createForm.data.label}
                                    onChange={(e) => createForm.setData('label', e.target.value)}
                                    placeholder="Total Aduan Masuk"
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                        <div className="flex-1 w-full">
                            <Field label="Nilai" error={createForm.errors.value}>
                                <input
                                    type="text"
                                    value={createForm.data.value}
                                    onChange={(e) => createForm.setData('value', e.target.value)}
                                    placeholder="1.245"
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="mt-1 sm:mt-6 px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                            Tambah
                        </button>
                    </form>
                </SectionCard>

                {/* DAFTAR STATISTIK */}
                <SectionCard label="Daftar Statistik" dot="bg-purple">
                    {stats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <BarChart3 className="text-gray-200 mb-3" size={30} />
                            <p className="text-sm text-gray-400">Belum ada statistik. Tambahkan lewat form di atas.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.id}
                                    className="rounded-xl border border-navy/5 p-3 sm:p-4 flex items-center gap-3 hover:border-crimson/20 transition-colors"
                                >
                                    {/* TOMBOL REORDER */}
                                    <div className="flex flex-col gap-0.5 shrink-0">
                                        <button
                                            onClick={() => move(index, 'up')}
                                            disabled={index === 0}
                                            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-navy/5 hover:text-navy disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
                                            title="Pindah ke atas"
                                        >
                                            <ChevronUp size={15} />
                                        </button>
                                        <button
                                            onClick={() => move(index, 'down')}
                                            disabled={index === stats.length - 1}
                                            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-navy/5 hover:text-navy disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
                                            title="Pindah ke bawah"
                                        >
                                            <ChevronDown size={15} />
                                        </button>
                                    </div>

                                    {editingId === stat.id ? (
                                        // MODE EDIT
                                        <form
                                            onSubmit={(e) => submitEdit(e, stat.id)}
                                            className="flex-1 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                                        >
                                            <input
                                                type="text"
                                                value={editForm.data.label}
                                                onChange={(e) => editForm.setData('label', e.target.value)}
                                                className={inputClass + ' flex-1'}
                                            />
                                            <input
                                                type="text"
                                                value={editForm.data.value}
                                                onChange={(e) => editForm.setData('value', e.target.value)}
                                                className={inputClass + ' sm:w-32'}
                                            />
                                            <label className="flex items-center gap-2 text-sm text-navy/60 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.data.is_active}
                                                    onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                                    className="rounded border-navy/20 text-crimson focus:ring-crimson/30"
                                                />
                                                Aktif
                                            </label>
                                            <div className="flex gap-2 shrink-0">
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
                                        // MODE TAMPIL
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-navy">
                                                    {stat.value}{' '}
                                                    {!stat.is_active && (
                                                        <span className="ml-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-crimson/10 text-crimson">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">{stat.label}</p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    onClick={() => startEdit(stat)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-navy/50 hover:bg-navy/5 hover:text-navy transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => destroy(stat.id)}
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
                </SectionCard>
            </div>
        </AdminLayout>
    );
}