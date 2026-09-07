import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Upload, X, FileText, Save, ArrowLeft, Image as ImageIcon, Video } from 'lucide-react';

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

function Field({ label, required, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-navy/70 mb-1.5">
                {label} {required && <span className="text-crimson">*</span>}
            </label>
            {children}
            {error && <p className="mt-1.5 text-xs text-crimson">{error}</p>}
        </div>
    );
}

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

export default function Edit({ report, categories, settings }) {
    const [newAttachments, setNewAttachments] = useState([]);
    const [existingAttachments, setExistingAttachments] = useState(report.attachments ?? []);
    const [removedIds, setRemovedIds] = useState([]);

    const { data, setData, put, processing, errors } = useForm({
        category_id: report.category_id ?? '',
        title: report.title ?? '',
        description: report.description ?? '',
        is_anonymous: report.is_anonymous ?? false,
        attachments: [],
        removed_attachment_ids: [],
    });

    const remainingSlots = settings.max_attachment_count - existingAttachments.length - newAttachments.length;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > remainingSlots) {
            alert(`Maksimal ${settings.max_attachment_count} lampiran total (sisa slot: ${remainingSlots}).`);
            return;
        }
        const updated = [...newAttachments, ...files];
        setNewAttachments(updated);
        setData('attachments', updated);
    };

    const removeNewAttachment = (index) => {
        const updated = newAttachments.filter((_, i) => i !== index);
        setNewAttachments(updated);
        setData('attachments', updated);
    };

    const removeExistingAttachment = (attachment) => {
        setExistingAttachments((prev) => prev.filter((a) => a.id !== attachment.id));
        const updatedIds = [...removedIds, attachment.id];
        setRemovedIds(updatedIds);
        setData('removed_attachment_ids', updatedIds);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('reports.update', report.id), { forceFormData: true });
    };

    return (
        <UserLayout
            title="Edit Aduan"
            subtitle={`${report.code} · masih bisa diubah selama belum diproses admin.`}
            headerAction={
                <Link
                    href={route('reports.index')}
                    className="inline-flex items-center gap-1.5 text-navy text-sm font-medium bg-navy/5 hover:bg-navy/10 px-4 py-2 rounded-full transition-colors w-fit"
                >
                    <ArrowLeft size={15} /> Laporan Saya
                </Link>
            }
        >
            <Head title={`Edit ${report.code}`} />

            <form onSubmit={submit} className="space-y-5 max-w-2xl">
                <SectionCard label="Detail Laporan" dot="bg-crimson">
                    <div className="space-y-4">
                        <Field label="Kategori" required error={errors.category_id}>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Pilih kategori...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Judul" required error={errors.title}>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Contoh: Lampu kelas mati"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Isi Laporan" required error={errors.description}>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={5}
                                placeholder="Jelaskan detail laporanmu di sini..."
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </SectionCard>

                {/* LAMPIRAN */}
                <SectionCard label={`Lampiran (maks ${settings.max_attachment_count} file)`} dot="bg-gold">
                    {existingAttachments.length > 0 && (
                        <ul className="space-y-2 mb-3">
                            {existingAttachments.map((att) => (
                                <li
                                    key={att.id}
                                    className="flex items-center justify-between gap-3 bg-navy/[0.03] rounded-xl px-3.5 py-2.5 text-sm"
                                >
                                    <a
                                        href={`/storage/${att.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 min-w-0 text-navy hover:text-crimson transition-colors"
                                    >
                                        {att.file_type === 'image' ? (
                                            <ImageIcon size={15} className="text-navy/40 shrink-0" />
                                        ) : (
                                            <Video size={15} className="text-navy/40 shrink-0" />
                                        )}
                                        <span className="truncate">Lampiran #{att.id}</span>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => removeExistingAttachment(att)}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-navy/40 hover:bg-crimson/10 hover:text-crimson transition-colors shrink-0"
                                    >
                                        <X size={14} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {remainingSlots > 0 && (
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-navy/10 rounded-xl py-6 cursor-pointer hover:border-crimson/40 hover:bg-crimson/[0.02] transition-colors">
                            <Upload size={18} className="text-gray-400" />
                            <span className="text-sm text-gray-500">
                                Klik untuk upload foto/video (sisa {remainingSlots} slot)
                            </span>
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/mp4,video/quicktime"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    )}

                    {newAttachments.length > 0 && (
                        <ul className="mt-3 space-y-2">
                            {newAttachments.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between gap-3 bg-navy/[0.03] rounded-xl px-3.5 py-2.5 text-sm"
                                >
                                    <span className="flex items-center gap-2 min-w-0 text-navy">
                                        <FileText size={15} className="text-navy/40 shrink-0" />
                                        <span className="truncate">{file.name}</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeNewAttachment(index)}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-navy/40 hover:bg-crimson/10 hover:text-crimson transition-colors shrink-0"
                                    >
                                        <X size={14} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {errors.attachments && <p className="mt-2 text-xs text-crimson">{errors.attachments}</p>}
                </SectionCard>

                {/* IDENTITAS — cuma muncul kalau admin masih mengizinkan kirim anonim */}
                {settings.allow_anonymous && (
                    <SectionCard label="Identitas" dot="bg-purple">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <label
                                className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                                    !data.is_anonymous ? 'border-crimson bg-crimson/10 text-crimson' : 'border-navy/10 text-navy/60 hover:border-navy/20'
                                }`}
                            >
                                <input
                                    type="radio"
                                    checked={!data.is_anonymous}
                                    onChange={() => setData('is_anonymous', false)}
                                    className="text-crimson focus:ring-crimson/30"
                                />
                                Kirim dengan identitas
                            </label>
                            <label
                                className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                                    data.is_anonymous ? 'border-crimson bg-crimson/10 text-crimson' : 'border-navy/10 text-navy/60 hover:border-navy/20'
                                }`}
                            >
                                <input
                                    type="radio"
                                    checked={data.is_anonymous}
                                    onChange={() => setData('is_anonymous', true)}
                                    className="text-crimson focus:ring-crimson/30"
                                />
                                Kirim secara anonim
                            </label>
                        </div>
                    </SectionCard>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full inline-flex items-center justify-center gap-2 bg-crimson text-white font-semibold py-3 rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                >
                    <Save size={16} />
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </form>
        </UserLayout>
    );
}