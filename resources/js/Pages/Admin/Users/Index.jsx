import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    UserPlus,
    Pencil,
    Power,
    ShieldAlert,
    Trash2,
    Users as UsersIcon,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

const statusStyle = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-navy/5 text-navy/50',
    blocked: 'bg-crimson/10 text-crimson',
};

const statusLabel = {
    active: 'Aktif',
    inactive: 'Nonaktif',
    blocked: 'Diblokir',
};

const roleStyle = {
    admin: 'bg-purple/15 text-purple',
    user: 'bg-navy/5 text-navy/60',
};

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
        <AdminLayout
            title="Kelola User"
            subtitle="Kelola akun pengguna dan admin dashboard."
        >
            <Head title="Kelola User" />

            <div className="space-y-5">
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

                <div className="flex justify-end">
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors"
                    >
                        <UserPlus size={15} />
                        Tambah User
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-navy/[0.03]">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Nama</th>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Role</th>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-navy/60 text-xs uppercase tracking-wide">Aduan</th>
                                    <th className="px-4 py-3 text-right font-semibold text-navy/60 text-xs uppercase tracking-wide">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy/5">
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <UsersIcon className="text-gray-200 mb-3" size={30} />
                                                <p className="text-sm text-gray-400">Belum ada user.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-navy/[0.02] transition-colors">
                                        <td className="px-4 py-3 text-navy font-medium">
                                            {user.name}
                                            {user.id === auth.user.id && (
                                                <span className="ml-1 text-xs text-gray-400">(kamu)</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`capitalize px-2.5 py-1 rounded-full text-xs font-medium ${roleStyle[user.role] ?? roleStyle.user}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[user.status]}`}>
                                                {statusLabel[user.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{user.reports_count ?? 0}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-navy/50 hover:bg-navy/5 hover:text-navy transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                {user.id !== auth.user.id && (
                                                    <>
                                                        {user.status !== 'active' && (
                                                            <button
                                                                onClick={() => updateStatus(user, 'active')}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                                title="Aktifkan"
                                                            >
                                                                <Power size={15} />
                                                            </button>
                                                        )}
                                                        {user.status !== 'inactive' && (
                                                            <button
                                                                onClick={() => updateStatus(user, 'inactive')}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a6d00] hover:bg-gold/20 transition-colors"
                                                                title="Nonaktifkan"
                                                            >
                                                                <Power size={15} />
                                                            </button>
                                                        )}
                                                        {user.status !== 'blocked' && (
                                                            <button
                                                                onClick={() => updateStatus(user, 'blocked')}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-crimson/60 hover:bg-crimson/10 hover:text-crimson transition-colors"
                                                                title="Blokir"
                                                            >
                                                                <ShieldAlert size={15} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => destroy(user)}
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-crimson/60 hover:bg-crimson/10 hover:text-crimson transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={15} />
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
                    <h2 className="text-lg font-semibold text-navy">Tambah User Baru</h2>

                    <Field label="Nama" error={createForm.errors.name}>
                        <input
                            type="text"
                            value={createForm.data.name}
                            onChange={(e) => createForm.setData('name', e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Email" error={createForm.errors.email}>
                        <input
                            type="email"
                            value={createForm.data.email}
                            onChange={(e) => createForm.setData('email', e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Password" error={createForm.errors.password}>
                        <input
                            type="password"
                            value={createForm.data.password}
                            onChange={(e) => createForm.setData('password', e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Konfirmasi Password">
                        <input
                            type="password"
                            value={createForm.data.password_confirmation}
                            onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Role">
                        <select
                            value={createForm.data.role}
                            onChange={(e) => createForm.setData('role', e.target.value)}
                            className={inputClass}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </Field>

                    <div className="flex justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setShowCreate(false)}
                            className="px-5 py-2.5 bg-navy/5 text-navy/70 text-sm font-semibold rounded-full hover:bg-navy/10 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL EDIT USER */}
            <Modal show={!!editingUser} onClose={() => setEditingUser(null)}>
                <form onSubmit={submitEdit} className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-navy">Edit User</h2>

                    <Field label="Nama" error={editForm.errors.name}>
                        <input
                            type="text"
                            value={editForm.data.name}
                            onChange={(e) => editForm.setData('name', e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Email" error={editForm.errors.email}>
                        <input
                            type="email"
                            value={editForm.data.email}
                            onChange={(e) => editForm.setData('email', e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Role">
                        <select
                            value={editForm.data.role}
                            onChange={(e) => editForm.setData('role', e.target.value)}
                            className={inputClass}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <p className="mt-1.5 text-xs text-gray-400">
                            Jadikan "Admin" untuk memberi akses penuh ke dashboard admin.
                        </p>
                    </Field>

                    <div className="flex justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="px-5 py-2.5 bg-navy/5 text-navy/70 text-sm font-semibold rounded-full hover:bg-navy/10 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}