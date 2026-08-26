import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Settings({ settings }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        footer_copyright: settings.footer_copyright,
        footer_email: settings.footer_email,
        footer_phone: settings.footer_phone,
        footer_address: settings.footer_address,
        social_instagram: settings.social_instagram,
        social_facebook: settings.social_facebook,
        social_youtube: settings.social_youtube,
        social_whatsapp: settings.social_whatsapp,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.landing.settings.update'));
    };

    const inputClass =
        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Edit Landing Page — Pengaturan Umum</h2>}
        >
            <Head title="Kelola Landing Page" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <form onSubmit={submit} className="space-y-6">

                        {/* SECTION: HERO */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Bagian Hero</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Hero</label>
                                    <input
                                        type="text"
                                        value={data.hero_title}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.hero_title && <p className="mt-1 text-sm text-red-600">{errors.hero_title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subjudul Hero</label>
                                    <textarea
                                        rows={3}
                                        value={data.hero_subtitle}
                                        onChange={(e) => setData('hero_subtitle', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.hero_subtitle && <p className="mt-1 text-sm text-red-600">{errors.hero_subtitle}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECTION: FOOTER / KONTAK */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Footer & Kontak</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={data.footer_email}
                                        onChange={(e) => setData('footer_email', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.footer_email && <p className="mt-1 text-sm text-red-600">{errors.footer_email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telepon</label>
                                    <input
                                        type="text"
                                        value={data.footer_phone}
                                        onChange={(e) => setData('footer_phone', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.footer_phone && <p className="mt-1 text-sm text-red-600">{errors.footer_phone}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Alamat Instansi</label>
                                    <textarea
                                        rows={2}
                                        value={data.footer_address}
                                        onChange={(e) => setData('footer_address', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.footer_address && <p className="mt-1 text-sm text-red-600">{errors.footer_address}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Teks Copyright</label>
                                    <input
                                        type="text"
                                        value={data.footer_copyright}
                                        onChange={(e) => setData('footer_copyright', e.target.value)}
                                        className={inputClass}
                                        placeholder="© 2026 SIAP SMEKDA — SMK Negeri 1 Daha Selatan."
                                    />
                                    {errors.footer_copyright && <p className="mt-1 text-sm text-red-600">{errors.footer_copyright}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECTION: SOCIAL MEDIA */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Social Media</h3>
                            <p className="text-sm text-gray-500 mb-4">Kosongkan field yang tidak dipakai — link-nya otomatis disembunyikan di landing page.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Instagram (URL)</label>
                                    <input
                                        type="url"
                                        value={data.social_instagram}
                                        onChange={(e) => setData('social_instagram', e.target.value)}
                                        className={inputClass}
                                        placeholder="https://instagram.com/..."
                                    />
                                    {errors.social_instagram && <p className="mt-1 text-sm text-red-600">{errors.social_instagram}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Facebook (URL)</label>
                                    <input
                                        type="url"
                                        value={data.social_facebook}
                                        onChange={(e) => setData('social_facebook', e.target.value)}
                                        className={inputClass}
                                        placeholder="https://facebook.com/..."
                                    />
                                    {errors.social_facebook && <p className="mt-1 text-sm text-red-600">{errors.social_facebook}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">YouTube (URL)</label>
                                    <input
                                        type="url"
                                        value={data.social_youtube}
                                        onChange={(e) => setData('social_youtube', e.target.value)}
                                        className={inputClass}
                                        placeholder="https://youtube.com/..."
                                    />
                                    {errors.social_youtube && <p className="mt-1 text-sm text-red-600">{errors.social_youtube}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">WhatsApp (nomor)</label>
                                    <input
                                        type="text"
                                        value={data.social_whatsapp}
                                        onChange={(e) => setData('social_whatsapp', e.target.value)}
                                        className={inputClass}
                                        placeholder="62812xxxxxxx"
                                    />
                                    {errors.social_whatsapp && <p className="mt-1 text-sm text-red-600">{errors.social_whatsapp}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <div className="flex items-center gap-4 bg-white p-6 shadow sm:rounded-lg">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Simpan Perubahan
                            </button>
                            {recentlySuccessful && <span className="text-sm text-gray-600">Tersimpan.</span>}
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}