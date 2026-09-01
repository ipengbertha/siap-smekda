import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Power, Trash2, Check, X, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

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

export default function Index({ categories }) {
    const { flash } = usePage().props;
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({ name: '', description: '' });
    const editForm = useForm({ name: '', description: '', is_active: true });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.categories.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const startEdit = (category) => {
        setEditingId(category.id);
        editForm.setData({
            name: category.name,
            description: category.description ?? '',
            is_active: category.is_active,
        });
    };

    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route('admin.categories.update', id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const toggleActive = (category) => {
        router.patch(route('admin.categories.toggle-active', category.id), {}, { preserveScroll: true });
    };

    const destroy = (category) => {
        if (confirm(`Yakin mau hapus kategori "${category.name}"?`)) {
            router.delete(route('admin.categories.destroy', category.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout
            title="Kelola Kategori"
            subtitle="Kelola kategori yang bisa dipilih pengguna saat mengirim aduan."
        >
            <Head title="Kelola Kategori" />

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
                <SectionCard label="Tambah Kategori Baru" dot="bg-crimson">
                    <form onSubmit={submitCreate} className="space-y-4">
                        <Field label="Nama Kategori" error={createForm.errors.name}>
                            <input
                                type="text"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="Contoh: Fasilitas Sekolah"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Deskripsi" error={createForm.errors.description}>
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
                            Tambah Kategori
                        </button>
                    </form>
                </SectionCard>

                {/* DAFTAR KATEGORI */}
                <SectionCard label="Daftar Kategori" dot="bg-purple">
                    {categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <Tag className="text-gray-200 mb-3" size={30} />
                            <p className="text-sm text-gray-400">Belum ada kategori.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="rounded-xl border border-navy/5 p-3 sm:p-4 flex gap-3 hover:border-crimson/20 transition-colors"
                                >
                                    {editingId === category.id ? (
                                        <form onSubmit={(e) => submitEdit(e, category.id)} className="flex-1 space-y-3">
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
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-navy">
                                                    {category.name}{' '}
                                                    {!category.is_active && (
                                                        <span className="ml-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-crimson/10 text-crimson">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </p>
                                                {category.description && (
                                                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-1.5">
                                                    {category.reports_count ?? 0} aduan memakai kategori ini
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1 shrink-0">
                                                <button
                                                    onClick={() => startEdit(category)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-navy/50 hover:bg-navy/5 hover:text-navy transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => toggleActive(category)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a6d00] hover:bg-gold/20 transition-colors"
                                                    title={category.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    <Power size={15} />
                                                </button>
                                                <button
                                                    onClick={() => destroy(category)}
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