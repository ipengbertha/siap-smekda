import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap gap-1 justify-center py-4">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true, preserveState: true })}
                    className={`px-3 py-1.5 text-sm rounded-md border ${
                        link.active
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Kelola Tanggapan</h2>}
        >
            <Head title="Kelola Tanggapan" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                    )}

                    <form onSubmit={submitSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kode aduan atau isi tanggapan..."
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
                            Cari
                        </button>
                    </form>

                    <div className="bg-white shadow sm:rounded-lg divide-y">
                        {responses.data.length === 0 && (
                            <p className="p-6 text-sm text-gray-500">Belum ada tanggapan.</p>
                        )}

                        {responses.data.map((response) => (
                            <div key={response.id} className="p-4 space-y-2">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <Link
                                        href={route('admin.reports.show', response.report.id)}
                                        className="font-mono text-indigo-600 hover:underline"
                                    >
                                        {response.report.code}
                                    </Link>
                                    <span>{response.user?.name ?? 'Admin'}</span>
                                </div>
                                <p className="text-sm text-gray-700 truncate">{response.report.title}</p>

                                {editingId === response.id ? (
                                    <form onSubmit={(e) => submitEdit(e, response.id)} className="space-y-2">
                                        <textarea
                                            rows={3}
                                            value={editForm.data.message}
                                            onChange={(e) => editForm.setData('message', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        />
                                        {editForm.errors.message && (
                                            <p className="text-sm text-red-600">{editForm.errors.message}</p>
                                        )}
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
                                    <>
                                        <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-800">
                                            {response.message}
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => startEdit(response)}
                                                className="text-sm text-indigo-600 hover:text-indigo-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => destroy(response)}
                                                className="text-sm text-red-600 hover:text-red-800"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <Pagination links={responses.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
