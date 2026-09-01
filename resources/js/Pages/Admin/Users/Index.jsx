import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const statusStyles = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    blocked: 'bg-red-100 text-red-700',
};

const statusLabels = {
    active: 'Aktif',
    inactive: 'Nonaktif',
    blocked: 'Diblokir',
};

export default function Index({ users }) {
    const { flash, auth } = usePage().props;
    const [showCreate, setShowCreate] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const editForm = useForm({ name: '', email: '', role: 'user' });

    const openCreate = () => {
        createForm.reset();
        createForm.clearErrors();
        setShowCreate(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            onSuccess: () => {
                createForm.reset();
                setShowCreate(false);
            },
        });
    };

    const openEdit = (user) => {
        editForm.clearErrors();
        editForm.setData({ name: user.name, email: user.email, role: user.role });
        setEditingUser(user);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('admin.users.update', editingUser.id), {
            onSuccess: () => setEditingUser(null),
        });
    };

    const updateStatus = (user, status) => {
        const confirmMsg = {
            active: `Aktifkan kembali akun ${user.name}?`,
            inactive: `Nonaktifkan akun ${user.name}?`,
            blocked: `Blokir akun ${user.name}? User tidak akan bisa login.`,
        }[status];

        if (confirm(confirmMsg)) {
            router.patch(route('admin.users.update-status', user.id), { status }, { preserveScroll: true });
        }
    };

    const destroy = (user) => {
        if (confirm(`Yakin mau hapus user "${user.name}"? Semua data terkait akan ikut hilang.`)) {
            router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Kelola User</h2>}
        >
            <Head title="Kelola User" />

            <div className="py-6">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{flash.error}</div>
                    )}

                    <div className="flex justify-end">
                        <PrimaryButton onClick={openCreate}>+ Tambah User</PrimaryButton>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Nama</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Aduan</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3 text-gray-900 font-medium">
                                            {user.name}
                                            {user.id === auth.user.id && (
                                                <span className="ml-1 text-xs text-gray-400">(kamu)</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className="capitalize px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[user.status]}`}>
                                                {statusLabels[user.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{user.reports_count ?? 0}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end flex-wrap gap-2">
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Edit
                                                </button>
                                                {user.id !== auth.user.id && (
                                                    <>
                                                        {user.status !== 'active' && (
                                                            <button
                                                                onClick={() => updateStatus(user, 'active')}
                                                                className="text-green-600 hover:text-green-800"
                                                            >
                                                                Aktifkan
                                                            </button>
                                                        )}
                                                        {user.status !== 'inactive' && (
                                                            <button
                                                                onClick={() => updateStatus(user, 'inactive')}
                                                                className="text-yellow-600 hover:text-yellow-800"
                                                            >
                                                                Nonaktifkan
                                                            </button>
                                                        )}
                                                        {user.status !== 'blocked' && (
                                                            <button
                                                                onClick={() => updateStatus(user, 'blocked')}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                Blokir
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => destroy(user)}
                                                            className="text-red-700 font-medium hover:text-red-900"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL TAMBAH USER */}
            <Modal show={showCreate} onClose={() => setShowCreate(false)}>
                <form onSubmit={submitCreate} className="p-6 space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">Tambah User Baru</h2>

                    <div>
                        <InputLabel htmlFor="name" value="Nama" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={createForm.data.name}
                            onChange={(e) => createForm.setData('name', e.target.value)}
                        />
                        <InputError message={createForm.errors.name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={createForm.data.email}
                            onChange={(e) => createForm.setData('email', e.target.value)}
                        />
                        <InputError message={createForm.errors.email} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={createForm.data.password}
                            onChange={(e) => createForm.setData('password', e.target.value)}
                        />
                        <InputError message={createForm.errors.password} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="mt-1 block w-full"
                            value={createForm.data.password_confirmation}
                            onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="role" value="Role" />
                        <select
                            id="role"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            value={createForm.data.role}
                            onChange={(e) => createForm.setData('role', e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowCreate(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={createForm.processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL EDIT USER */}
            <Modal show={!!editingUser} onClose={() => setEditingUser(null)}>
                <form onSubmit={submitEdit} className="p-6 space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">Edit User</h2>

                    <div>
                        <InputLabel htmlFor="edit_name" value="Nama" />
                        <TextInput
                            id="edit_name"
                            className="mt-1 block w-full"
                            value={editForm.data.name}
                            onChange={(e) => editForm.setData('name', e.target.value)}
                        />
                        <InputError message={editForm.errors.name} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_email" value="Email" />
                        <TextInput
                            id="edit_email"
                            type="email"
                            className="mt-1 block w-full"
                            value={editForm.data.email}
                            onChange={(e) => editForm.setData('email', e.target.value)}
                        />
                        <InputError message={editForm.errors.email} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_role" value="Role" />
                        <select
                            id="edit_role"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            value={editForm.data.role}
                            onChange={(e) => editForm.setData('role', e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-400">
                            Jadikan "Admin" untuk memberi akses penuh ke dashboard admin.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setEditingUser(null)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={editForm.processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
