import AdminLayout from '@/Layouts/AdminLayout';
import UserLayout from '@/Layouts/UserLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
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

// Toggle switch sederhana, dipakai untuk tiap jenis notifikasi.
function ToggleRow({ label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 border-b border-navy/5 last:border-b-0">
            <div className="min-w-0">
                <p className="text-sm font-medium text-navy">{label}</p>
                {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    checked ? 'bg-crimson' : 'bg-navy/15'
                }`}
            >
                <span
                    className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-transform ${
                        checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
                    }`}
                />
            </button>
        </div>
    );
}

export default function NotificationSettings({ settings }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';
    const Layout = isAdmin ? AdminLayout : UserLayout;

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        notify_new_report: settings.notify_new_report,
        notify_report_responded: settings.notify_report_responded,
        notify_status_changed: settings.notify_status_changed,
        notify_report_completed: settings.notify_report_completed,
        notify_pengumuman: settings.notify_pengumuman,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('notification-settings.update'), { preserveScroll: true });
    };

    return (
        <Layout title="Pengaturan Notifikasi" subtitle="Atur jenis pemberitahuan yang ingin kamu terima.">
            <Head title="Pengaturan Notifikasi" />

            <form onSubmit={submit} className="space-y-5 max-w-2xl">
                {isAdmin ? (
                    // Admin hanya menangani aduan orang lain (tidak pernah jadi pelapor),
                    // jadi cuma toggle "aduan baru" yang relevan buat dia.
                    <SectionCard label="Aduan Masuk" dot="bg-crimson">
                        <ToggleRow
                            label="Notifikasi ketika ada aduan baru"
                            description="Kirim notifikasi ke kamu setiap ada aduan baru yang perlu ditindaklanjuti."
                            checked={data.notify_new_report}
                            onChange={(val) => setData('notify_new_report', val)}
                        />
                    </SectionCard>
                ) : (
                    // User biasa hanya jadi pelapor, jadi cuma toggle terkait aduannya sendiri yang relevan.
                    <SectionCard label="Status Aduan Saya" dot="bg-gold" description="Berlaku untuk aduan yang kamu buat sendiri.">
                        <ToggleRow
                            label="Notifikasi ketika ada balasan/tambahan informasi"
                            description="Kirim notifikasi saat admin memberi tanggapan pada aduanmu."
                            checked={data.notify_report_responded}
                            onChange={(val) => setData('notify_report_responded', val)}
                        />
                        <ToggleRow
                            label="Notifikasi ketika status berubah"
                            description="Kirim notifikasi saat status aduanmu berubah (diterima, diproses, dsb)."
                            checked={data.notify_status_changed}
                            onChange={(val) => setData('notify_status_changed', val)}
                        />
                        <ToggleRow
                            label="Notifikasi ketika aduan selesai"
                            description="Kirim notifikasi saat aduanmu ditandai selesai ditangani."
                            checked={data.notify_report_completed}
                            onChange={(val) => setData('notify_report_completed', val)}
                        />
                    </SectionCard>
                )}

                {/* Berlaku untuk semua role, bukan eksklusif seperti section di atas —
                    pengumuman ditujukan ke admin maupun user biasa. */}
                <SectionCard label="Pengumuman" dot="bg-purple">
                    <ToggleRow
                        label="Notifikasi pengumuman"
                        description="Kirim notifikasi saat ada pengumuman baru dari admin."
                        checked={data.notify_pengumuman}
                        onChange={(val) => setData('notify_pengumuman', val)}
                    />
                </SectionCard>

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
        </Layout>
    );
}