import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ steps }) {
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({ title: '', description: '' });
    const editForm = useForm({ title: '', description: '' });

    const inputClass =
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm';

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.landing.steps.store'), {
            onSuccess: () => createForm.reset(),
        });
    };

    const startEdit = (step) => {
        setEditingId(step.id);
        editForm.setData({ title: step.title, description: step.description });
    };

    const submitEdit = (e, id) => {
        e.preventDefault();
        editForm.put(route('admin.landing.steps.update', id), {
            onSuccess: () => setEditingId(null),
        });
    };

    const destroy = (id) => {
        if (confirm('Yakin mau hapus langkah ini?')) {
            router.delete(route('admin.landing.steps.destroy', id));
        }
    };

    const move = (index, direction) => {
        const newSteps = [...steps];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSteps.length) return;

        [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
        router.post(
            route('admin.landing.steps.reorder'),
            { ids: newSteps.map((s) => s.id) },
            { preserveScroll: true }
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Edit Landing Page — Cara Kerja</h2>}
        >
            <Head title="Kelola Cara Kerja" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* FORM TAMBAH */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Langkah Baru</h3>
                        <form onSubmit={submitCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Judul Langkah</label>
                                <input
                                    type="text"
                                    value={createForm.data.title}
                                    onChange={(e) => createForm.setData('title', e.target.value)}
                                    placeholder="Sampaikan"
                                    className={inputClass}
                                />
                                {createForm.errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{createForm.errors.title}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea
                                    rows={3}
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    className={inputClass}
                                />
                                {createForm.errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{createForm.errors.description}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Tambah Langkah
                            </button>
                        </form>
                    </div>

                    {/* DAFTAR LANGKAH */}
                    <div className="bg-white shadow sm:rounded-lg divide-y">
                        {steps.length === 0 && (
                            <p className="p-6 text-sm text-gray-500">Belum ada langkah. Tambahkan lewat form di atas.</p>
                        )}

                        {steps.map((step, index) => (
                            <div key={step.id} className="p-4 flex gap-3">

                                {/* NOMOR URUT + TOMBOL REORDER */}
                                <div className="flex flex-col items-center gap-1">
                                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex flex-col gap-0.5">
                                        <button
                                            onClick={() => move(index, 'up')}
                                            disabled={index === 0}
                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs"
                                            title="Pindah ke atas"
                                        >
                                            ▲
                                        </button>
                                        <button
                                            onClick={() => move(index, 'down')}
                                            disabled={index === steps.length - 1}
                                            className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs"
                                            title="Pindah ke bawah"
                                        >
                                            ▼
                                        </button>
                                    </div>
                                </div>

                                {editingId === step.id ? (
                                    // MODE EDIT
                                    <form onSubmit={(e) => submitEdit(e, step.id)} className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            value={editForm.data.title}
                                            onChange={(e) => editForm.setData('title', e.target.value)}
                                            className={inputClass}
                                        />
                                        <textarea
                                            rows={3}
                                            value={editForm.data.description}
                                            onChange={(e) => editForm.setData('description', e.target.value)}
                                            className={inputClass}
                                        />
                                        <div className="flex items-center gap-3">
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
                                            <p className="font-medium text-gray-900">{step.title}</p>
                                            <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => startEdit(step)}
                                                className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => destroy(step.id)}
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