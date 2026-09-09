import AdminLayout from '@/Layouts/AdminLayout';
import UserLayout from '@/Layouts/UserLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import ProfileInfoForm from './Partials/ProfileInfoForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const Layout = isAdmin ? AdminLayout : UserLayout;

    return (
        <Layout
            title={isAdmin ? 'Profil Admin' : 'Profil Saya'}
            subtitle="Kelola informasi akun dan keamanan login kamu."
        >
            <Head title={isAdmin ? 'Profil Admin' : 'Profil Saya'} />

            <div className="space-y-5 max-w-2xl">
                <ProfileInfoForm mustVerifyEmail={mustVerifyEmail} status={status} user={auth.user} />
                <UpdatePasswordForm />

                {/* Hapus akun sengaja disembunyikan buat admin — supaya admin nggak
                    tanpa sadar menghapus satu-satunya akun admin yang aktif. */}
                {!isAdmin && <DeleteUserForm />}
            </div>
        </Layout>
    );
}