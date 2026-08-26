import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ stats }) {
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({ label: '', value: '' });
    const editForm = useForm({ label: '', value: '', is_active: true });

    const inputClass =
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm';

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
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Edit Landing Page — Statistik</h2>}
        >
            <Head title="Kelola Statistik" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* FORM TAMBAH */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Statistik Baru</h3>
                        <form onSubmit={submitCreate} className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700">Label</label>
                                <input
                                    type="text"
                                    value={createForm.data.label}
                                    onChange={(e) => createForm.setData('label', e.target.value)}
                                    placeholder="Total Aduan Masuk"
                                    className={inputClass}
                                />
                                {createForm.errors.label && (
                                    <p className="mt-1 text-sm text-red-600">{createForm.errors.label}</p>
                                )}
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700">Nilai</label>
                                <input
                                    type="text"
                                    value={createForm.data.value}
                                    onChange={(e) => createForm.setData('value', e.target.value)}
                                    placeholder="1.245"
                                    className={inputClass}
                                />
                                {createForm.errors.value && (
                                    <p className="mt-1 text-sm text-red-600">{createForm.errors.value}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="mt-6 sm:mt-6 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
                            >
                                Tambah
                            </button>
                        </form>
                    </div>

                    {/* DAFTAR STATISTIK */}
                    <div className="bg-white shadow sm:rounded-lg divide-y">
                        {stats.length === 0 && (
                            <p className="p-6 text-sm text-gray-500">Belum ada statistik. Tambahkan lewat form di atas.</p>
                        )}

                        {stats.map((stat, index) => (
                            <div key={stat.id} className="p-4 flex items-center gap-3">

                                {/* TOMBOL REORDER */}
                                <div className="flex flex-col gap-1">
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
                                        disabled={index === stats.length - 1}
                                        className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                        title="Pindah ke bawah"
                                    >
                                        ▼
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
                                            className={inputClass + ' w-32'}
                                        />
                                        <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={editForm.data.is_active}
                                                onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                            />
                                            Aktif
                                        </label>
                                        <div className="flex gap-2">
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
                                                {stat.value}{' '}
                                                {!stat.is_active && (
                                                    <span className="text-xs font-normal text-red-500">(nonaktif)</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500">{stat.label}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(stat)}
                                                className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => destroy(stat.id)}
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