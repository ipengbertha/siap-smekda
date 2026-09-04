import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Pencil, Power, Trash2, Check, X, MapPin, CheckCircle2, AlertCircle, Search } from 'lucide-react';

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

export default function Index({ destinations }) {
    const { flash } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');

    const createForm = useForm({ name: '', description: '' });
    const editForm = useForm({ name: '', description: '', is_active: true });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.destinations.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const startEdit = (destination) => {
        setEditingId(destination.id);
        editForm.setData({
            name: destination.name,
            description: destination.description ?? '',
            is_active: destination.is_active,
        });
    };

    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route('admin.destinations.update', id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const toggleActive = (destination) => {
        router.patch(route('admin.destinations.toggle-active', destination.id), {}, { preserveScroll: true });
    };

    const destroy = (destination) => {
        if (confirm(`Yakin mau hapus tujuan "${destination.name}"?`)) {
            router.delete(route('admin.destinations.destroy', destination.id), { preserveScroll: true });
        }
    };

    // Filter di sisi klien — jumlah tujuan biasanya kecil, jadi nggak perlu round-trip ke server.
    const filteredDestinations = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return destinations;
        return destinations.filter(
            (d) =>
                d.name.toLowerCase().includes(q) ||
                (d.description ?? '').toLowerCase().includes(q)
        );
    }, [destinations, search]);

    return (
        <AdminLayout
            title="Kelola Tujuan"
            subtitle="Kelola daftar tujuan/pihak yang bisa dipilih untuk menerima aduan."
        >
            <Head title="Kelola Tujuan" />

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

                {/* FORM TAMBAH */}
                <SectionCard label="Tambah Tujuan Baru" dot="bg-crimson">
                    <form onSubmit={submitCreate} className="space-y-4">
                        <Field label="Nama Tujuan" error={createForm.errors.name}>
                            <input
                                type="text"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="Contoh: Wakasek Sarpras"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Deskripsi">
                            <textarea
                                rows={2}
                                value={createForm.data.description}
                                onChange={(e) => createForm.setData('description', e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                        >
                            Tambah Tujuan
                        </button>
                    </form>
                </SectionCard>

                {/* DAFTAR TUJUAN */}
                <SectionCard label="Daftar Tujuan" dot="bg-purple">
                    {/* Search bar */}
                    <div className="relative mb-4">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari tujuan..."
                            className={`${inputClass} pl-10`}
                        />
                    </div>

                    {destinations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <MapPin className="text-gray-200 mb-3" size={30} />
                            <p className="text-sm text-gray-400">Belum ada tujuan.</p>
                        </div>
                    ) : filteredDestinations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <Search className="text-gray-200 mb-3" size={30} />
                            <p className="text-sm text-gray-400">
                                Nggak ada tujuan yang cocok dengan &quot;{search}&quot;.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredDestinations.map((destination) => (
                                <div
                                    key={destination.id}
                                    className="rounded-xl border border-navy/5 px-3 sm:px-4 py-2.5 hover:border-crimson/20 transition-colors"
                                >
                                    {editingId === destination.id ? (
                                        <form onSubmit={(e) => submitEdit(e, destination.id)} className="space-y-3">
                                            <Field error={editForm.errors.name}>
                                                <input
                                                    type="text"
                                                    value={editForm.data.name}
                                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                                    className={inputClass}
                                                />
                                            </Field>
                                            <textarea
                                                rows={2}
                                                value={editForm.data.description}
                                                onChange={(e) => editForm.setData('description', e.target.value)}
                                                className={inputClass}
                                            />
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center gap-2 text-sm text-navy/60">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.data.is_active}
                                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                                        className="rounded border-navy/20 text-crimson focus:ring-crimson/30"
                                                    />
                                                    Aktif
                                                </label>
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
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0 flex items-baseline gap-2">
                                                <p className="font-semibold text-navy shrink-0">
                                                    {destination.name}
                                                </p>
                                                {!destination.is_active && (
                                                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-crimson/10 text-crimson shrink-0">
                                                        Nonaktif
                                                    </span>
                                                )}
                                                <p className="text-xs text-gray-400 truncate">
                                                    {destination.description && `${destination.description} · `}
                                                    {destination.reports_count ?? 0} aduan
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={() => startEdit(destination)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-navy/50 hover:bg-navy/5 hover:text-navy transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => toggleActive(destination)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a6d00] hover:bg-gold/20 transition-colors"
                                                    title={destination.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    <Power size={15} />
                                                </button>
                                                <button
                                                    onClick={() => destroy(destination)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-crimson/60 hover:bg-crimson/10 hover:text-crimson transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
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