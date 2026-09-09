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

function Field({ label, error, hint, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-navy/70 mb-1.5">{label}</label>
            {children}
            {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
            {error && <p className="mt-1.5 text-xs text-crimson">{error}</p>}
        </div>
    );
}

function Toggle({ label, description, checked, onChange }) {
    return (
        <label className="flex items-start justify-between gap-4 py-3 cursor-pointer">
            <div>
                <p className="text-sm font-medium text-navy">{label}</p>
                {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    checked ? 'bg-crimson' : 'bg-navy/15'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </label>
    );
}

const statusLabel = {
    terkirim: 'Terkirim',
    diterima: 'Diterima',
    diproses: 'Diproses',
    ditanggapi: 'Ditanggapi',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
    diblokir: 'Diblokir',
};

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

export default function Settings({ settings, availableStatuses }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        report_allow_anonymous: settings.report_allow_anonymous,
        report_allow_edit: settings.report_allow_edit,
        report_allow_delete: settings.report_allow_delete,
        report_max_attachment_size_kb: settings.report_max_attachment_size_kb,
        report_allowed_attachment_formats: settings.report_allowed_attachment_formats,
        report_max_attachment_count: settings.report_max_attachment_count,
        report_disabled_statuses: settings.report_disabled_statuses,
    });

    const toggleStatus = (status) => {
        const isDisabled = data.report_disabled_statuses.includes(status);
        setData(
            'report_disabled_statuses',
            isDisabled
                ? data.report_disabled_statuses.filter((s) => s !== status)
                : [...data.report_disabled_statuses, status]
        );
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.reports.settings.update'));
    };

    return (
        <AdminLayout
            title="Pengaturan Aduan"
            subtitle="Kelola aturan pengiriman aduan: anonimitas, lampiran, edit/hapus, dan status aktif."
        >
            <Head title="Pengaturan Aduan" />

            <form onSubmit={submit} className="space-y-5 max-w-3xl">
                {/* HAK AKSES PELAPOR */}
                <SectionCard
                    label="Hak Akses Pelapor"
                    dot="bg-crimson"
                    description="Atur apa yang boleh dilakukan pelapor terhadap aduan miliknya sendiri."
                >
                    <div className="divide-y divide-navy/5">
                        <Toggle
                            label="Izinkan kirim anonim"
                            description="Jika dimatikan, semua pelapor wajib mencantumkan identitas."
                            checked={data.report_allow_anonymous}
                            onChange={(v) => setData('report_allow_anonymous', v)}
                        />
                        <Toggle
                            label="Izinkan edit aduan sendiri"
                            description="Pelapor boleh mengubah aduan miliknya selama statusnya masih 'Terkirim' (belum diproses admin)."
                            checked={data.report_allow_edit}
                            onChange={(v) => setData('report_allow_edit', v)}
                        />
                        <Toggle
                            label="Izinkan hapus aduan sendiri"
                            description="Pelapor boleh menghapus aduan miliknya selama statusnya masih 'Terkirim'."
                            checked={data.report_allow_delete}
                            onChange={(v) => setData('report_allow_delete', v)}
                        />
                    </div>
                </SectionCard>

                {/* LAMPIRAN */}
                <SectionCard label="Batasan Lampiran" dot="bg-gold">
                    <div className="space-y-4">
                        <Field
                            label="Maksimal jumlah lampiran"
                            error={errors.report_max_attachment_count}
                        >
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={data.report_max_attachment_count}
                                onChange={(e) => setData('report_max_attachment_count', e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field
                            label="Maksimal ukuran per file (MB)"
                            error={errors.report_max_attachment_size_kb}
                            hint="Disimpan dalam KB di sistem, 1 MB = 1024 KB."
                        >
                            <input
                                type="number"
                                min={1}
                                value={Math.round(data.report_max_attachment_size_kb / 1024)}
                                onChange={(e) => setData('report_max_attachment_size_kb', Number(e.target.value) * 1024)}
                                className={inputClass}
                            />
                        </Field>

                        <Field
                            label="Format file yang diizinkan"
                            error={errors.report_allowed_attachment_formats}
                            hint="Pisahkan dengan koma, contoh: jpg,jpeg,png,mp4,mov"
                        >
                            <input
                                type="text"
                                value={data.report_allowed_attachment_formats}
                                onChange={(e) => setData('report_allowed_attachment_formats', e.target.value)}
                                className={inputClass}
                                placeholder="jpg,jpeg,png,mp4,mov"
                            />
                        </Field>
                    </div>
                </SectionCard>

                {/* STATUS AKTIF */}
                <SectionCard
                    label="Status Aduan yang Tersedia"
                    dot="bg-purple"
                    description="Matikan status yang tidak dipakai sekolah ini. Ke-7 status ini tetap baku di sistem — hanya bisa dinyala/matikan, bukan diganti nama atau ditambah baru, supaya tidak merusak logic dashboard & Sorotan Publik."
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availableStatuses.map((status) => {
                            const active = !data.report_disabled_statuses.includes(status);
                            return (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => toggleStatus(status)}
                                    className={`px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-colors ${
                                        active
                                            ? 'border-crimson bg-crimson/10 text-crimson'
                                            : 'border-navy/10 text-navy/40 hover:border-navy/20'
                                    }`}
                                >
                                    {statusLabel[status] ?? status}
                                    <span className="block text-xs font-normal mt-0.5">
                                        {active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {errors.report_disabled_statuses && (
                        <p className="mt-3 text-xs text-crimson">{errors.report_disabled_statuses}</p>
                    )}
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