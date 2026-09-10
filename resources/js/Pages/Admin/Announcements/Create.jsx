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

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

export default function Create() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        title: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.announcements.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout
            title="Buat Pengumuman"
            subtitle="Pengumuman akan dikirim sebagai notifikasi ke semua user yang mengaktifkan preferensi 'Notifikasi pengumuman'."
        >
            <Head title="Buat Pengumuman" />

            <form onSubmit={submit} className="space-y-5 max-w-2xl">
                <SectionCard label="Isi Pengumuman" dot="bg-purple">
                    <div className="space-y-4">
                        <Field label="Judul" error={errors.title}>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={inputClass}
                                placeholder="Contoh: Libur Semester Ganjil"
                            />
                        </Field>

                        <Field label="Isi Pesan" error={errors.message}>
                            <textarea
                                rows={5}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className={inputClass}
                                placeholder="Tulis isi pengumuman di sini..."
                            />
                        </Field>
                    </div>
                </SectionCard>

                <div className="flex items-center gap-4 bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                    >
                        Kirim Pengumuman
                    </button>
                    {recentlySuccessful && (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                            <CheckCircle2 size={16} />
                            Terkirim.
                        </span>
                    )}
                </div>
            </form>
        </AdminLayout>
    );
}