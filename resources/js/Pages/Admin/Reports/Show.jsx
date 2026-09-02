import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Image, Film, ShieldAlert, Trash2, Send, Eye, EyeOff } from 'lucide-react';

const statusLabel = {
    terkirim: 'Terkirim',
    diterima: 'Diterima',
    diproses: 'Diproses',
    ditanggapi: 'Ditanggapi',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
    diblokir: 'Diblokir',
};

const statusStyle = {
    terkirim: 'bg-gray-100 text-gray-600',
    diterima: 'bg-purple/15 text-purple',
    diproses: 'bg-gold/20 text-[#8a6d00]',
    ditanggapi: 'bg-purple/15 text-purple',
    selesai: 'bg-emerald-100 text-emerald-700',
    ditolak: 'bg-crimson/10 text-crimson',
    diblokir: 'bg-navy text-white',
};

function SectionCard({ label, dot, children }) {
    return (
        <div className="bg-navy/[0.03] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4 px-1">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <h3 className="text-sm font-semibold text-navy">{label}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">{children}</div>
        </div>
    );
}

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

export default function Show({ report, destinations, statuses }) {
    const statusForm = useForm({
        status: report.status,
        note: '',
        destination_id: report.destination?.id ?? '',
    });

    const responseForm = useForm({ message: '', is_internal: false });

    const submitStatus = (e) => {
        e.preventDefault();
        statusForm.patch(route('admin.reports.update-status', report.id), {
            preserveScroll: true,
            onSuccess: () => statusForm.setData('note', ''),
        });
    };

    const submitResponse = (e) => {
        e.preventDefault();
        responseForm.post(route('admin.reports.responses.store', report.id), {
            preserveScroll: true,
            onSuccess: () => responseForm.reset(),
        });
    };

    const blockReport = () => {
        if (confirm('Blokir aduan ini? Aduan akan disembunyikan dan tidak bisa diproses lebih lanjut.')) {
            router.patch(
                route('admin.reports.update-status', report.id),
                { status: 'diblokir', note: 'Aduan diblokir oleh admin.' },
                { preserveScroll: true }
            );
        }
    };

    const destroy = () => {
        if (confirm(`Yakin mau hapus aduan "${report.code}"? Tindakan ini tidak bisa dibatalkan.`)) {
            router.delete(route('admin.reports.destroy', report.id));
        }
    };

    return (
        <AdminLayout
            title={`Detail Aduan ${report.code}`}
            subtitle="Kelola status, tujuan, dan tanggapan untuk aduan ini."
        >
            <Head title={`Aduan ${report.code}`} />

            <div className="space-y-5 max-w-4xl">
                <Link
                    href={route('admin.reports.index')}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-crimson hover:text-crimson-dark"
                >
                    <ArrowLeft size={15} /> Kembali ke daftar
                </Link>

                {/* DETAIL ADUAN */}
                <SectionCard label="Detail Aduan" dot="bg-crimson">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs text-gray-500">{report.code}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[report.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {statusLabel[report.status] ?? report.status}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line mb-4">{report.description}</p>

                    <dl className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-navy/5">
                        <div>
                            <dt className="text-gray-400 text-xs mb-0.5">Tipe</dt>
                            <dd className="text-navy capitalize font-medium">{report.type}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400 text-xs mb-0.5">Kategori</dt>
                            <dd className="text-navy font-medium">{report.category?.name ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400 text-xs mb-0.5">Tujuan</dt>
                            <dd className="text-navy font-medium">{report.destination?.name ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400 text-xs mb-0.5">Pelapor</dt>
                            <dd className="text-navy font-medium">
                                {report.is_anonymous ? 'Anonim' : report.user?.name ?? report.reporter_name ?? '-'}
                            </dd>
                        </div>
                        {!report.is_anonymous && report.user?.email && (
                            <div>
                                <dt className="text-gray-400 text-xs mb-0.5">Email</dt>
                                <dd className="text-navy font-medium">{report.user.email}</dd>
                            </div>
                        )}
                        {report.reporter_contact && (
                            <div>
                                <dt className="text-gray-400 text-xs mb-0.5">Kontak</dt>
                                <dd className="text-navy font-medium">{report.reporter_contact}</dd>
                            </div>
                        )}
                    </dl>

                    {report.attachments?.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-navy/5">
                            <p className="text-gray-400 text-xs mb-2">Lampiran</p>
                            <div className="flex flex-wrap gap-2">
                                {report.attachments.map((att) => (
                                    <a
                                        key={att.id}
                                        href={`/storage/${att.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-navy/5 rounded-full text-navy hover:bg-navy/10 transition-colors"
                                    >
                                        {att.file_type === 'image' ? <Image size={13} /> : <Film size={13} />}
                                        Lihat lampiran
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </SectionCard>

                {/* UBAH STATUS */}
                <SectionCard label="Ubah Status Aduan" dot="bg-gold">
                    <form onSubmit={submitStatus} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1.5">Status</label>
                                <select
                                    value={statusForm.data.status}
                                    onChange={(e) => statusForm.setData('status', e.target.value)}
                                    className={inputClass}
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {statusLabel[status] ?? status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-navy/70 mb-1.5">Tujuan</label>
                                <select
                                    value={statusForm.data.destination_id}
                                    onChange={(e) => statusForm.setData('destination_id', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="">- Belum ditentukan -</option>
                                    {destinations.map((dest) => (
                                        <option key={dest.id} value={dest.id}>
                                            {dest.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-1.5">Catatan (opsional)</label>
                            <textarea
                                rows={2}
                                value={statusForm.data.note}
                                onChange={(e) => statusForm.setData('note', e.target.value)}
                                placeholder="Catatan internal terkait perubahan status ini"
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={statusForm.processing}
                                className="px-5 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                            >
                                Simpan Status
                            </button>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={blockReport}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#8a6d00] hover:bg-gold/10 rounded-full transition-colors"
                                >
                                    <ShieldAlert size={15} /> Blokir Aduan
                                </button>
                                <button
                                    type="button"
                                    onClick={destroy}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-crimson hover:bg-crimson/10 rounded-full transition-colors"
                                >
                                    <Trash2 size={15} /> Hapus Aduan
                                </button>
                            </div>
                        </div>
                    </form>
                </SectionCard>

                {/* RIWAYAT STATUS */}
                {report.status_histories?.length > 0 && (
                    <SectionCard label="Riwayat Status" dot="bg-purple">
                        <ol className="space-y-4">
                            {report.status_histories.map((h) => (
                                <li key={h.id} className="text-sm border-l-2 border-purple/20 pl-4 relative">
                                    <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-purple" />
                                    <span className="font-semibold text-navy">{statusLabel[h.status] ?? h.status}</span>
                                    {h.note && <span className="text-gray-500"> — {h.note}</span>}
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        {new Date(h.created_at).toLocaleString('id-ID')}
                                        {h.changed_by && ` · oleh ${h.changed_by.name}`}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </SectionCard>
                )}

                {/* TANGGAPAN */}
                <SectionCard label="Tanggapan" dot="bg-emerald-400">
                    {report.responses?.length === 0 && (
                        <p className="text-sm text-gray-400 mb-4">Belum ada tanggapan.</p>
                    )}

                    <div className="space-y-2.5 mb-4">
                        {report.responses?.map((r) => (
                            <div
                                key={r.id}
                                className={`p-3.5 rounded-xl text-sm ${
                                    r.is_internal
                                        ? 'bg-gold/10 border border-gold/30'
                                        : r.is_admin
                                        ? 'bg-crimson/5 border border-crimson/10'
                                        : 'bg-navy/[0.03]'
                                }`}
                            >
                                <div className="flex justify-between items-center text-xs text-gray-400 mb-1.5">
                                    <span className="font-semibold text-navy/70 inline-flex items-center gap-1.5">
                                        {r.is_admin ? `Admin${r.user ? ` (${r.user.name})` : ''}` : r.user?.name ?? 'Pelapor'}
                                        {r.is_internal && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/20 text-[#8a6d00] text-[10px] font-semibold">
                                                <EyeOff size={10} /> Internal
                                            </span>
                                        )}
                                    </span>
                                    <span>{new Date(r.created_at).toLocaleString('id-ID')}</span>
                                </div>
                                <p className="text-navy">{r.message}</p>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={submitResponse} className="space-y-3 pt-4 border-t border-navy/5">
                        <textarea
                            rows={3}
                            value={responseForm.data.message}
                            onChange={(e) => responseForm.setData('message', e.target.value)}
                            placeholder="Tulis tanggapan untuk pelapor..."
                            className={inputClass}
                        />
                        {responseForm.errors.message && (
                            <p className="text-xs text-crimson">{responseForm.errors.message}</p>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-navy/70 mb-1.5">
                                Tujuan tanggapan
                            </label>
                            <div className="inline-flex rounded-full bg-navy/[0.04] p-1 gap-1">
                                <button
                                    type="button"
                                    onClick={() => responseForm.setData('is_internal', false)}
                                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                        !responseForm.data.is_internal
                                            ? 'bg-crimson text-white'
                                            : 'text-navy/50 hover:text-navy'
                                    }`}
                                >
                                    <Eye size={13} /> Kirim ke Pelapor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => responseForm.setData('is_internal', true)}
                                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                        responseForm.data.is_internal
                                            ? 'bg-gold text-[#3f3300]'
                                            : 'text-navy/50 hover:text-navy'
                                    }`}
                                >
                                    <EyeOff size={13} /> Catatan Internal
                                </button>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1.5">
                                {responseForm.data.is_internal
                                    ? 'Catatan ini cuma kelihatan di dashboard admin, pelapor nggak akan melihatnya di halaman lacak.'
                                    : 'Tanggapan ini akan langsung tampil ke pelapor di halaman lacak aduan.'}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={responseForm.processing}
                            className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50 ${
                                responseForm.data.is_internal
                                    ? 'bg-gold text-[#3f3300] hover:bg-gold/90'
                                    : 'bg-crimson hover:bg-crimson-dark'
                            }`}
                        >
                            <Send size={14} /> {responseForm.data.is_internal ? 'Simpan Catatan' : 'Kirim Tanggapan'}
                        </button>
                    </form>
                </SectionCard>
            </div>
        </AdminLayout>
    );
}