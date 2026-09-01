import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Power, Trash2, Check, X, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

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

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

export default function Index({ bannedWords }) {
    const { flash } = usePage().props;
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({ word: '' });
    const editForm = useForm({ word: '', is_active: true });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.banned-words.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const startEdit = (bannedWord) => {
        setEditingId(bannedWord.id);
        editForm.setData({ word: bannedWord.word, is_active: bannedWord.is_active });
    };

    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route('admin.banned-words.update', id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const toggleActive = (bannedWord) => {
        router.patch(route('admin.banned-words.toggle-active', bannedWord.id), {}, { preserveScroll: true });
    };

    const destroy = (bannedWord) => {
        if (confirm(`Yakin mau hapus kata "${bannedWord.word}"?`)) {
            router.delete(route('admin.banned-words.destroy', bannedWord.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout
            title="Kata Terlarang"
            subtitle="Aduan yang mengandung salah satu kata aktif di bawah ini otomatis ditolak sistem."
        >
            <Head title="Kelola Kata Terlarang" />

            <div className="space-y-5 max-w-2xl">
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
                <SectionCard label="Tambah Kata Terlarang" dot="bg-crimson">
                    <form onSubmit={submitCreate} className="flex gap-3">
                        <input
                            type="text"
                            value={createForm.data.word}
                            onChange={(e) => createForm.setData('word', e.target.value)}
                            placeholder="Contoh: anjing"
                            className={inputClass}
                        />
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                            Tambah
                        </button>
                    </form>
                    {createForm.errors.word && (
                        <p className="mt-2 text-xs text-crimson">{createForm.errors.word}</p>
                    )}
                </SectionCard>

                {/* DAFTAR KATA */}
                <SectionCard label="Daftar Kata Terlarang" dot="bg-purple">
                    {bannedWords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <ShieldAlert className="text-gray-200 mb-3" size={30} />
                            <p className="text-sm text-gray-400">Belum ada kata terlarang.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {bannedWords.map((bannedWord) => (
                                <div
                                    key={bannedWord.id}
                                    className="rounded-xl border border-navy/5 p-3 flex items-center gap-3 hover:border-crimson/20 transition-colors"
                                >
                                    {editingId === bannedWord.id ? (
                                        <form
                                            onSubmit={(e) => submitEdit(e, bannedWord.id)}
                                            className="flex-1 flex items-center gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={editForm.data.word}
                                                onChange={(e) => editForm.setData('word', e.target.value)}
                                                className={inputClass}
                                            />
                                            <button
                                                type="submit"
                                                disabled={editForm.processing}
                                                className="w-8 h-8 rounded-full bg-crimson/10 text-crimson flex items-center justify-center hover:bg-crimson/20 transition-colors shrink-0"
                                                title="Simpan"
                                            >
                                                <Check size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingId(null)}
                                                className="w-8 h-8 rounded-full bg-navy/5 text-navy/50 flex items-center justify-center hover:bg-navy/10 transition-colors shrink-0"
                                                title="Batal"
                                            >
                                                <X size={15} />
                                            </button>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <span className="font-semibold text-navy">{bannedWord.word}</span>{' '}
                                                {!bannedWord.is_active && (
                                                    <span className="ml-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-crimson/10 text-crimson">
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    onClick={() => startEdit(bannedWord)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-navy/50 hover:bg-navy/5 hover:text-navy transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => toggleActive(bannedWord)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a6d00] hover:bg-gold/20 transition-colors"
                                                    title={bannedWord.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    <Power size={15} />
                                                </button>
                                                <button
                                                    onClick={() => destroy(bannedWord)}
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