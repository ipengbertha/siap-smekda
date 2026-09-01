import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

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
        'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

    return (
        <AdminLayout
            title="Pengaturan Umum"
            subtitle="Kelola konten hero, kontak, dan sosial media di landing page."
        >
            <Head title="Kelola Landing Page" />

            <form onSubmit={submit} className="space-y-5 max-w-4xl">
                {/* SECTION: HERO */}
                <SectionCard label="Bagian Hero" dot="bg-crimson">
                    <div className="space-y-4">
                        <Field label="Judul Hero" error={errors.hero_title}>
                            <input
                                type="text"
                                value={data.hero_title}
                                onChange={(e) => setData('hero_title', e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Subjudul Hero" error={errors.hero_subtitle}>
                            <textarea
                                rows={3}
                                value={data.hero_subtitle}
                                onChange={(e) => setData('hero_subtitle', e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </SectionCard>

                {/* SECTION: FOOTER / KONTAK */}
                <SectionCard label="Footer & Kontak" dot="bg-purple">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Email" error={errors.footer_email}>
                            <input
                                type="email"
                                value={data.footer_email}
                                onChange={(e) => setData('footer_email', e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Telepon" error={errors.footer_phone}>
                            <input
                                type="text"
                                value={data.footer_phone}
                                onChange={(e) => setData('footer_phone', e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <div className="sm:col-span-2">
                            <Field label="Alamat Instansi" error={errors.footer_address}>
                                <textarea
                                    rows={2}
                                    value={data.footer_address}
                                    onChange={(e) => setData('footer_address', e.target.value)}
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        <div className="sm:col-span-2">
                            <Field label="Teks Copyright" error={errors.footer_copyright}>
                                <input
                                    type="text"
                                    value={data.footer_copyright}
                                    onChange={(e) => setData('footer_copyright', e.target.value)}
                                    className={inputClass}
                                    placeholder="© 2026 SIAP SMEKDA — SMK Negeri 1 Daha Selatan."
                                />
                            </Field>
                        </div>
                    </div>
                </SectionCard>

                {/* SECTION: SOCIAL MEDIA */}
                <SectionCard
                    label="Social Media"
                    dot="bg-gold"
                    description="Kosongkan field yang tidak dipakai — link-nya otomatis disembunyikan di landing page."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Instagram (URL)" error={errors.social_instagram}>
                            <input
                                type="url"
                                value={data.social_instagram}
                                onChange={(e) => setData('social_instagram', e.target.value)}
                                className={inputClass}
                                placeholder="https://instagram.com/..."
                            />
                        </Field>

                        <Field label="Facebook (URL)" error={errors.social_facebook}>
                            <input
                                type="url"
                                value={data.social_facebook}
                                onChange={(e) => setData('social_facebook', e.target.value)}
                                className={inputClass}
                                placeholder="https://facebook.com/..."
                            />
                        </Field>

                        <Field label="YouTube (URL)" error={errors.social_youtube}>
                            <input
                                type="url"
                                value={data.social_youtube}
                                onChange={(e) => setData('social_youtube', e.target.value)}
                                className={inputClass}
                                placeholder="https://youtube.com/..."
                            />
                        </Field>

                        <Field label="WhatsApp (nomor)" error={errors.social_whatsapp}>
                            <input
                                type="text"
                                value={data.social_whatsapp}
                                onChange={(e) => setData('social_whatsapp', e.target.value)}
                                className={inputClass}
                                placeholder="62812xxxxxxx"
                            />
                        </Field>
                    </div>
                </SectionCard>

                {/* SUBMIT */}
                <div className="flex items-center gap-4 bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                    >
                        Simpan Perubahan
                    </button>
                    {recentlySuccessful && (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                            <CheckCircle2 size={16} />
                            Tersimpan.
                        </span>
                    )}
                </div>
            </form>
        </AdminLayout>
    );
}