import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ faqs }) {
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({ question: '', answer: '' });
    const editForm = useForm({ question: '', answer: '', is_active: true });

    const inputClass =
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm';

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.landing.faqs.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const startEdit = (faq) => {
        setEditingId(faq.id);
        editForm.setData({ question: faq.question, answer: faq.answer, is_active: faq.is_active });
    };

    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route('admin.landing.faqs.update', id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const destroy = (id) => {
        if (confirm('Yakin mau hapus FAQ ini?')) {
            router.delete(route('admin.landing.faqs.destroy', id));
        }
    };

    const move = (index, direction) => {
        const newFaqs = [...faqs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newFaqs.length) return;

        [newFaqs[index], newFaqs[targetIndex]] = [newFaqs[targetIndex], newFaqs[index]];
        router.post(
            route('admin.landing.faqs.reorder'),
            { ids: newFaqs.map((f) => f.id) },
            { preserveScroll: true }
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Edit Landing Page — FAQ</h2>}
        >
            <Head title="Kelola FAQ" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* FORM TAMBAH */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah FAQ Baru</h3>
                        <form onSubmit={submitCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pertanyaan</label>
                                <input
                                    type="text"
                                    value={createForm.data.question}
                                    onChange={(e) => createForm.setData('question', e.target.value)}
                                    placeholder="Apakah saya harus login untuk mengirim aduan?"
                                    className={inputClass}
                                />
                                {createForm.errors.question && (
                                    <p className="mt-1 text-sm text-red-600">{createForm.errors.question}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Jawaban</label>
                                <textarea
                                    rows={3}
                                    value={createForm.data.answer}
                                    onChange={(e) => createForm.setData('answer', e.target.value)}
                                    className={inputClass}
                                />
                                {createForm.errors.answer && (
                                    <p className="mt-1 text-sm text-red-600">{createForm.errors.answer}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Tambah FAQ
                            </button>
                        </form>
                    </div>

                    {/* DAFTAR FAQ */}
                    <div className="bg-white shadow sm:rounded-lg divide-y">
                        {faqs.length === 0 && (
                            <p className="p-6 text-sm text-gray-500">Belum ada FAQ. Tambahkan lewat form di atas.</p>
                        )}

                        {faqs.map((faq, index) => (
                            <div key={faq.id} className="p-4 flex gap-3">

                                {/* TOMBOL REORDER */}
                                <div className="flex flex-col gap-1 pt-1">
                                    <button
                                        onClick={() => move(index, 'up')}
                                        disabled={index === 0}
                                        className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                        title="Pindah ke atas"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        onClick={() => move(index, 'down')}
                                        disabled={index === faqs.length - 1}
                                        className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                        title="Pindah ke bawah"
                                    >
                                        ▼
                                    </button>
                                </div>

                                {editingId === faq.id ? (
                                    // MODE EDIT
                                    <form onSubmit={(e) => submitEdit(e, faq.id)} className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            value={editForm.data.question}
                                            onChange={(e) => editForm.setData('question', e.target.value)}
                                            className={inputClass}
                                        />
                                        <textarea
                                            rows={3}
                                            value={editForm.data.answer}
                                            onChange={(e) => editForm.setData('answer', e.target.value)}
                                            className={inputClass}
                                        />
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.data.is_active}
                                                    onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                                />
                                                Aktif
                                            </label>
                                            <button
                                                type="submit"
                                                disabled={editForm.processing}
                                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                                            >
                                                Simpan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingId(null)}
                                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    // MODE TAMPIL
                                    <>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {faq.question}{' '}
                                                {!faq.is_active && (
                                                    <span className="text-xs font-normal text-red-500">(nonaktif)</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">{faq.answer}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => startEdit(faq)}
                                                className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => destroy(faq.id)}
                                                className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}